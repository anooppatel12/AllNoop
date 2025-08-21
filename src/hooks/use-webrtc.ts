'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDatabase, ref, set, onValue, off, remove, onDisconnect } from 'firebase/database';
import { getFirebaseApp } from '@/lib/firebase';

const firebaseApp = getFirebaseApp();
const database = getDatabase(firebaseApp);

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

type ConnectionState = RTCPeerConnectionState;

export const useWebRTC = (roomId: string, onMessage: (message: string) => void) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('new');
  const pc = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const isCaller = useRef(false);
  const myId = useRef(`peer_${crypto.randomUUID()}`);
  
  const roomRef = ref(database, `rooms/${roomId}`);
  const signalingRef = ref(database, `rooms/${roomId}/signaling`);
  const iceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates`);

  const sendMessage = useCallback((message: string) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(message);
    }
  }, []);

  useEffect(() => {
    const peerConnection = new RTCPeerConnection(configuration);
    pc.current = peerConnection;

    const handleConnectionStateChange = () => {
      if (pc.current) {
        setConnectionState(pc.current.connectionState);
      }
    };

    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        set(ref(database, `rooms/${roomId}/iceCandidates/${myId.current}`), event.candidate.toJSON());
      }
    };
    
    const handleDataChannel = (event: RTCDataChannelEvent) => {
      dataChannel.current = event.channel;
      dataChannel.current.onmessage = (e) => onMessage(e.data);
    };

    peerConnection.addEventListener('connectionstatechange', handleConnectionStateChange);
    peerConnection.addEventListener('icecandidate', handleIceCandidate);
    peerConnection.addEventListener('datachannel', handleDataChannel);

    const signalingListener = onValue(signalingRef, async (snapshot) => {
      const signalingData = snapshot.val();
      
      if (!pc.current || pc.current.signalingState === 'closed') return;

      if (!signalingData) {
        isCaller.current = true;
        const channel = peerConnection.createDataChannel('chat');
        channel.onmessage = (e) => onMessage(e.data);
        dataChannel.current = channel;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await set(signalingRef, { type: 'offer', sdp: offer.sdp });
      } else if (signalingData.type === 'offer' && !isCaller.current) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signalingData));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        await set(signalingRef, { type: 'answer', sdp: answer.sdp });
      } else if (signalingData.type === 'answer' && isCaller.current) {
        if (peerConnection.signalingState !== 'stable') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(signalingData));
        }
      }
    }, { onlyOnce: false });

    const iceCandidatesListener = onValue(iceCandidatesRef, (snapshot) => {
       if (!pc.current || pc.current.signalingState === 'closed') return;
      const candidates = snapshot.val() || {};
      Object.keys(candidates).forEach(peerId => {
        if (peerId !== myId.current) {
          if (peerConnection.remoteDescription) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidates[peerId]))
              .catch(() => {});
          }
        }
      });
    });
    
    onDisconnect(roomRef).remove();

    return () => {
      off(signalingRef, 'value', signalingListener);
      off(iceCandidatesRef, 'value', iceCandidatesListener);
      
      if (pc.current) {
        pc.current.removeEventListener('connectionstatechange', handleConnectionStateChange);
        pc.current.removeEventListener('icecandidate', handleIceCandidate);
        pc.current.removeEventListener('datachannel', handleDataChannel);
        pc.current.close();
        pc.current = null;
      }
      remove(roomRef);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return { connectionState, sendMessage };
};
