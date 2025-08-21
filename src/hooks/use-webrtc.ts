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
  const myId = useRef(`peer_${crypto.randomUUID()}`);
  
  const roomRef = ref(database, `rooms/${roomId}`);
  const signalingRef = ref(database, `rooms/${roomId}/signaling`);
  const iceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${myId.current}`);
  const otherIceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates`);

  useEffect(() => {
    const pc = new RTCPeerConnection(configuration);
    pcRef.current = pc;
    
    const handleConnectionStateChange = () => setConnectionState(pc.connectionState);
    pc.addEventListener('connectionstatechange', handleConnectionStateChange);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        set(iceCandidatesRef, event.candidate.toJSON());
      }
    };
    
    // THIS IS THE FIX: Set up the data channel handler for the callee (receiver)
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (e) => onMessage(e.data);
      dataChannelRef.current = channel;
    };

    const iceListener = onValue(otherIceCandidatesRef, (snapshot) => {
      if (!pcRef.current || pcRef.current.signalingState === 'closed') return;
      const candidates = snapshot.val();
      if (candidates) {
        Object.keys(candidates).forEach(peerId => {
          if (peerId !== myId.current) {
            pcRef.current?.addIceCandidate(new RTCIceCandidate(candidates[peerId])).catch(() => {});
          }
        });
      }
    });

    const signalingListener = onValue(signalingRef, async (snapshot) => {
      const signalingData = snapshot.val();
      
      if (!pcRef.current || pcRef.current.signalingState === 'closed') return;

      if (!signalingData) { 
        isCallerRef.current = true;
        
        dataChannelRef.current = pc.createDataChannel('chat');
        dataChannelRef.current.onmessage = (e) => onMessage(e.data);
        
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
    });
    
    return () => {
      pc.removeEventListener('connectionstatechange', handleConnectionStateChange);
      off(signalingRef, 'value', signalingListener);
      off(otherIceCandidatesRef, 'value', iceListener);
      
      if (pc.signalingState !== 'closed') {
        pc.close();
      }
      pcRef.current = null;
      remove(roomRef);
    };
    
  }, [roomId, onMessage, otherIceCandidatesRef, roomRef, signalingRef, iceCandidatesRef]);

  const sendMessage = useCallback((message: string) => {
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(message);
    }
  }, []);

  return { connectionState, sendMessage };
};
