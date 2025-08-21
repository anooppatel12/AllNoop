'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDatabase, ref, set, onValue, off, remove } from 'firebase/database';
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
  
  // Use a ref to ensure myId is stable across renders for a single component instance
  const myIdRef = useRef(`peer_${crypto.randomUUID()}`);

  useEffect(() => {
    // Moved ref creations inside useEffect
    const myId = myIdRef.current;
    const roomRef = ref(database, `rooms/${roomId}`);
    const signalingRef = ref(database, `rooms/${roomId}/signaling`);
    const iceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${myId}`);
    const otherIceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates`);
    
    const pc = new RTCPeerConnection(configuration);
    pcRef.current = pc;
    
    const handleConnectionStateChange = () => {
        if(pcRef.current) {
            setConnectionState(pcRef.current.connectionState);
        }
    }
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
    });

    const signalingListener = onValue(signalingRef, async (snapshot) => {
      if (!pcRef.current || pcRef.current.signalingState === 'closed') return;
      
      const signalingData = snapshot.val();
      
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
      
      if (pcRef.current && pcRef.current.signalingState !== 'closed') {
        pcRef.current.close();
      }
      pcRef.current = null;
      // Only the caller should remove the room data
      if (isCallerRef.current) {
          remove(roomRef);
      }
    };
    
  }, [roomId, onMessage]); // Stable dependency array

  const sendMessage = useCallback((message: string) => {
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(message);
    }
  }, []);

  return { connectionState, sendMessage };
};
