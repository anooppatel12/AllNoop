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

    // Setup ICE handling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        set(iceCandidatesRef, event.candidate.toJSON());
      }
    };
    
    // Setup data channel handling for callee
    pc.ondatachannel = (event) => {
      dataChannelRef.current = event.channel;
      dataChannelRef.current.onmessage = (e) => onMessage(e.data);
    };

    // Listen for ICE candidates from the other peer
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

    // Signaling logic
    const signalingListener = onValue(signalingRef, async (snapshot) => {
      const signalingData = snapshot.val();
      
      if (!pcRef.current || pcRef.current.signalingState === 'closed') return;

      if (!signalingData) { // This peer is the first one (caller)
        isCallerRef.current = true;
        
        // Create data channel for caller
        dataChannelRef.current = pc.createDataChannel('chat');
        dataChannelRef.current.onmessage = (e) => onMessage(e.data);
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await set(signalingRef, { type: 'offer', sdp: offer.sdp });
      
      } else if (signalingData.type === 'offer' && !isCallerRef.current) { // This peer is the second one (callee)
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
    
    // Cleanup on component unmount
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
    
  // onMessage is wrapped in useCallback in the parent component
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, onMessage]);

  const sendMessage = useCallback((message: string) => {
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(message);
    }
  }, []);

  return { connectionState, sendMessage };
};
