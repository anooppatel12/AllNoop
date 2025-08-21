
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDatabase, ref, set, onValue, remove, onDisconnect } from 'firebase/database';
import { getFirebaseApp } from '@/lib/firebase';

const firebaseApp = getFirebaseApp();
const database = getDatabase(firebaseApp);

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // You may add TURN servers here for more robust connections
  ],
};

type ConnectionState = RTCPeerConnectionState;

export const useWebRTC = (roomId: string, onMessage: (message: string) => void): { peerId: string | null; connectionState: ConnectionState, sendMessage: (message: string) => void, error: string | null } => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('new');
  const [error, setError] = useState<string | null>(null);
  
  const pc = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  const sendMessage = (message: string) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(message);
    }
  };

  const cleanup = useCallback(() => {
    if (pc.current) {
        pc.current.close();
        pc.current = null;
    }
    if (peerId) {
        const peerRef = ref(database, `rooms/${roomId}/peers/${peerId}`);
        remove(peerRef);
    }
    setConnectionState('disconnected');
  }, [roomId, peerId]);


  useEffect(() => {
    const myId = `peer_${crypto.randomUUID()}`;
    setPeerId(myId);
    
    const roomRef = ref(database, `rooms/${roomId}`);
    const myPeerRef = ref(database, `rooms/${roomId}/peers/${myId}`);
    
    // Set up onDisconnect listener to clean up Firebase
    onDisconnect(myPeerRef).remove();
    
    pc.current = new RTCPeerConnection(configuration);

    pc.current.onconnectionstatechange = () => {
        if(pc.current) {
            setConnectionState(pc.current.connectionState);
             if (pc.current.connectionState === 'connected') {
                // Once connected, we can remove the entire room signaling data
                remove(roomRef);
            }
        }
    };
    
     pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateRef = ref(database, `rooms/${roomId}/iceCandidates/${myId}`);
        set(candidateRef, event.candidate.toJSON());
      }
    };

    pc.current.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      dataChannel.current.onmessage = (e) => onMessage(e.data);
      dataChannel.current.onopen = () => console.log('Data channel open');
      dataChannel.current.onclose = () => console.log('Data channel closed');
    };
    
    const peersRef = ref(database, `rooms/${roomId}/peers`);
    onValue(peersRef, async (snapshot) => {
        const peers = snapshot.val() || {};
        const otherPeers = Object.keys(peers).filter(id => id !== myId);

        if(otherPeers.length > 0 && pc.current) { // We are the callee
             const otherPeerId = otherPeers[0];
             const offer = peers[otherPeerId].offer;

             if(offer && pc.current.signalingState === 'stable') {
                await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                set(myPeerRef, { answer });
             }

             const otherPeerCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${otherPeerId}`);
             onValue(otherPeerCandidatesRef, (candidateSnapshot) => {
                 if(candidateSnapshot.exists() && pc.current?.remoteDescription) {
                     pc.current.addIceCandidate(new RTCIceCandidate(candidateSnapshot.val()));
                 }
             }, { onlyOnce: true });
        } else { // We are the caller
             dataChannel.current = pc.current.createDataChannel('chat');
             dataChannel.current.onmessage = (e) => onMessage(e.data);
             dataChannel.current.onopen = () => console.log('Data channel open');
             dataChannel.current.onclose = () => console.log('Data channel closed');

             const offer = await pc.current.createOffer();
             await pc.current.setLocalDescription(offer);
             await set(myPeerRef, { offer });

             onValue(peersRef, (answerSnapshot) => {
                const updatedPeers = answerSnapshot.val() || {};
                const otherPeerId = Object.keys(updatedPeers).find(id => id !== myId && updatedPeers[id].answer);
                if(otherPeerId) {
                    const answer = updatedPeers[otherPeerId].answer;
                    if (pc.current && pc.current.signalingState !== 'stable') {
                         pc.current.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                }
             }, { onlyOnce: true });

            const otherPeerCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${otherPeers[0]}`);
             onValue(otherPeerCandidatesRef, (candidateSnapshot) => {
                 if(candidateSnapshot.exists() && pc.current?.remoteDescription) {
                     pc.current.addIceCandidate(new RTCIceCandidate(candidateSnapshot.val()));
                 }
             });
        }
    }, { onlyOnce: true });


    return () => {
      cleanup();
    };
  }, [roomId, onMessage, cleanup]);

  return { peerId, connectionState, sendMessage, error };
};
