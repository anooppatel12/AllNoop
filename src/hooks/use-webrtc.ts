'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDatabase, ref, set, onValue, remove, onDisconnect, goOffline, goOnline } from 'firebase/database';
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

  const sendMessage = useCallback((message: string) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(message);
    }
  }, []);

  useEffect(() => {
    goOnline(database);
    
    const peerConnection = new RTCPeerConnection(configuration);
    pc.current = peerConnection;
    
    const myId = `peer_${crypto.randomUUID()}`;
    const roomRef = ref(database, `rooms/${roomId}`);
    const signalingRef = ref(database, `rooms/${roomId}/signaling`);

    const setupPeerConnectionListeners = () => {
        peerConnection.onconnectionstatechange = () => {
            setConnectionState(peerConnection.connectionState);
        };
        
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                set(ref(database, `rooms/${roomId}/iceCandidates/${myId}`), event.candidate.toJSON());
            }
        };

        peerConnection.ondatachannel = (event) => {
            dataChannel.current = event.channel;
            dataChannel.current.onmessage = (e) => onMessage(e.data);
        };
    };

    setupPeerConnectionListeners();

    const startSignaling = async () => {
        onValue(signalingRef, async (snapshot) => {
            const signalingData = snapshot.val();
            
            if (!signalingData) { // This peer is the first one (caller)
                isCaller.current = true;

                dataChannel.current = peerConnection.createDataChannel('chat');
                dataChannel.current.onmessage = (e) => onMessage(e.data);
                
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                await set(signalingRef, { type: 'offer', sdp: offer.sdp });

            } else if (signalingData.type === 'offer' && !isCaller.current) { // This peer is the second one (callee)
                await peerConnection.setRemoteDescription(new RTCSessionDescription(signalingData));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                await set(signalingRef, { type: 'answer', sdp: answer.sdp });
            } else if (signalingData.type === 'answer' && isCaller.current) {
                if (peerConnection.signalingState !== 'stable') {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(signalingData));
                }
            }
        }, { onlyOnce: false }); // Listen continuously for signaling messages

        // Listen for ICE candidates from the other peer
        onValue(ref(database, `rooms/${roomId}/iceCandidates`), (snapshot) => {
            const candidates = snapshot.val() || {};
            Object.keys(candidates).forEach(peerId => {
                if (peerId !== myId) {
                    if (peerConnection.remoteDescription) {
                        peerConnection.addIceCandidate(new RTCIceCandidate(candidates[peerId]))
                            .catch(e => console.error("Error adding received ICE candidate", e));
                    }
                }
            });
        });
    };
    
    startSignaling();
    
    onDisconnect(roomRef).remove();

    return () => {
        if(peerConnection) {
          peerConnection.close();
        }
        remove(roomRef);
        goOffline(database);
    };

  }, [roomId, onMessage]);

  return { connectionState, sendMessage };
};
