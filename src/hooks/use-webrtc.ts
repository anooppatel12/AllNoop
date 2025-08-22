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
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const isCallerRef = useRef(false);

  useEffect(() => {
    const pc = new RTCPeerConnection(configuration);
    pcRef.current = pc;
    const myId = `peer_${crypto.randomUUID()}`;

    const roomRef = ref(database, `rooms/${roomId}`);
    const signalingRef = ref(database, `rooms/${roomId}/signaling`);
    const iceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${myId}`);
    const otherIceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates`);

    const handleConnectionStateChange = () => {
      if (pcRef.current) {
        setConnectionState(pcRef.current.connectionState);
      }
    };
    pc.addEventListener('connectionstatechange', handleConnectionStateChange);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        set(iceCandidatesRef, event.candidate.toJSON());
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (e) => onMessage(e.data);
      dataChannelRef.current = channel;
    };
    
    onDisconnect(roomRef).remove();

    const iceListener = onValue(otherIceCandidatesRef, (snapshot) => {
      if (!pcRef.current || pcRef.current.signalingState === 'closed') return;
      const candidates = snapshot.val();
      if (candidates) {
        Object.keys(candidates).forEach(peerId => {
          if (peerId !== myId) {
            pcRef.current?.addIceCandidate(new RTCIceCandidate(candidates[peerId])).catch(() => {});
          }
        });
      }
    }, { onlyOnce: false });

    const signalingListener = onValue(signalingRef, async (snapshot) => {
       if (!pcRef.current || pcRef.current.signalingState === 'closed') return;
      const signalingData = snapshot.val();
      
      if (!signalingData) { 
        isCallerRef.current = true;
         if (pcRef.current.signalingState === 'closed') return;
        const channel = pc.createDataChannel('chat');
        channel.onmessage = (e) => onMessage(e.data);
        dataChannelRef.current = channel;
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await set(signalingRef, { type: 'offer', sdp: offer.sdp });
      
      } else if (signalingData.type === 'offer' && !isCallerRef.current) { 
        await pc.setRemoteDescription(new RTCSessionDescription(signalingData));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await set(signalingRef, { type: 'answer', sdp: answer.sdp });
     
      } else if (signalingData.type === 'answer' && isCallerRef.current) {
        if (pc.signalingState !== 'stable') {
            await pc.setRemoteDescription(new RTCSessionDescription(signalingData));
        }
      }
    }, { onlyOnce: false });

    return () => {
      pc.removeEventListener('connectionstatechange', handleConnectionStateChange);
      off(signalingRef, 'value', signalingListener);
      off(otherIceCandidatesRef, 'value', iceListener);
      
      if (isCallerRef.current) {
          remove(roomRef);
      }
      
      if (pcRef.current && pcRef.current.signalingState !== 'closed') {
        pcRef.current.close();
      }
      pcRef.current = null;
    };
    
  }, [roomId, onMessage]);

  const sendMessage = useCallback((message: string) => {
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(message);
    }
  }, []);

  return { connectionState, sendMessage };
};
