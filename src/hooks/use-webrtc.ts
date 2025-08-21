'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDatabase, ref, set, onValue, remove, onDisconnect } from 'firebase/database';
import { getFirebaseApp } from '@/lib/firebase';

const firebaseApp = getFirebaseApp();
const database = getDatabase(firebaseApp);

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

type ConnectionState = RTCPeerConnectionState;

export const useWebRTC = (roomId: string, onMessage: (message: string) => void) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('new');
  const pc = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  
  const sendMessage = useCallback((message: string) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(message);
    }
  }, []);

  useEffect(() => {
    const myId = `peer_${crypto.randomUUID()}`;
    const peerConnection = new RTCPeerConnection(configuration);
    pc.current = peerConnection;

    const handleConnectionStateChange = () => {
        if(pc.current) {
            setConnectionState(pc.current.connectionState);
            if (pc.current.connectionState === 'connected') {
                // Once connected, we can clean up the signaling server data
                const roomRef = ref(database, `rooms/${roomId}`);
                remove(roomRef);
            }
        }
    };
    
    peerConnection.onconnectionstatechange = handleConnectionStateChange;
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateRef = ref(database, `rooms/${roomId}/iceCandidates/${myId}`);
        set(candidateRef, event.candidate.toJSON());
      }
    };

    peerConnection.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      dataChannel.current.onmessage = (e) => onMessage(e.data);
    };
    
    const roomRef = ref(database, `rooms/${roomId}`);
    const peersRef = ref(database, `rooms/${roomId}/peers`);

    const setupSignaling = async () => {
        onValue(peersRef, async (snapshot) => {
            if (!pc.current) return;
            
            const peers = snapshot.val() || {};
            const otherPeerId = Object.keys(peers).find(id => id !== myId);

            if (otherPeerId) { // We are the callee
                const offer = peers[otherPeerId].offer;
                if (offer && pc.current.signalingState === 'stable') {
                    await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await pc.current.createAnswer();
                    await pc.current.setLocalDescription(answer);
                    const myPeerRef = ref(database, `rooms/${roomId}/peers/${myId}`);
                    set(myPeerRef, { answer });

                     const otherPeerCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${otherPeerId}`);
                     onValue(otherPeerCandidatesRef, (candidateSnapshot) => {
                        if(candidateSnapshot.exists() && pc.current?.remoteDescription) {
                            pc.current.addIceCandidate(new RTCIceCandidate(candidateSnapshot.val()));
                        }
                    });
                }
            } else { // We are the caller
                dataChannel.current = pc.current.createDataChannel('chat');
                dataChannel.current.onmessage = (e) => onMessage(e.data);

                const offer = await pc.current.createOffer();
                await pc.current.setLocalDescription(offer);
                const myPeerRef = ref(database, `rooms/${roomId}/peers/${myId}`);
                await set(myPeerRef, { offer });

                onValue(peersRef, (answerSnapshot) => {
                    const updatedPeers = answerSnapshot.val() || {};
                    const answeringPeerId = Object.keys(updatedPeers).find(id => id !== myId && updatedPeers[id].answer);
                    if (answeringPeerId) {
                        const answer = updatedPeers[answeringPeerId].answer;
                        if (pc.current && pc.current.signalingState !== 'stable') {
                            pc.current.setRemoteDescription(new RTCSessionDescription(answer));
                        }
                        const otherPeerCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${answeringPeerId}`);
                        onValue(otherPeerCandidatesRef, (candidateSnapshot) => {
                            if(candidateSnapshot.exists() && pc.current?.remoteDescription) {
                                pc.current.addIceCandidate(new RTCIceCandidate(candidateSnapshot.val()));
                            }
                        });
                    }
                }, { onlyOnce: true });
            }
        }, { onlyOnce: true });
    };

    setupSignaling();

    const myPeerRef = ref(database, `rooms/${roomId}/peers/${myId}`);
    const myCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates/${myId}`);
    onDisconnect(myPeerRef).remove();
    onDisconnect(myCandidatesRef).remove();

    return () => {
      if (pc.current) {
        pc.current.onconnectionstatechange = null;
        pc.current.onicecandidate = null;
        pc.current.ondatachannel = null;
        pc.current.close();
      }
      // General cleanup of the room reference on component unmount
      remove(roomRef);
    };
  }, [roomId, onMessage]);

  return { connectionState, sendMessage };
};