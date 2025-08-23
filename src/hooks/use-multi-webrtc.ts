
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getDatabase, ref, onValue, off, remove, set, push, onDisconnect } from 'firebase/database';
import { getFirebaseApp } from '@/lib/firebase';
import { useToast } from './use-toast';

const firebaseApp = getFirebaseApp();
const database = getDatabase(firebaseApp);

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

type RemoteStream = { id: string; stream: MediaStream };

export const useMultiWebRTC = (roomId: string) => {
  const { toast } = useToast();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const myPeerIdRef = useRef<string | null>(null);
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const roomRef = ref(database, `video-rooms/${roomId}`);

  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices.", error);
      toast({
        variant: 'destructive',
        title: 'Camera/Mic Access Denied',
        description: 'Please enable permissions to use the video room.',
      });
      return null;
    }
  }, [toast]);
  
  const createPeerConnection = useCallback((peerId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(configuration);

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = event => {
      if (event.candidate) {
        const candidateRef = ref(database, `video-rooms/${roomId}/iceCandidates/${myPeerIdRef.current}/${peerId}`);
        set(candidateRef, event.candidate.toJSON());
      }
    };

    pc.ontrack = event => {
      setRemoteStreams(prev => {
        if (prev.some(s => s.id === peerId)) return prev;
        return [...prev, { id: peerId, stream: event.streams[0] }];
      });
    };
    
    pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed' || pc.connectionState === 'failed') {
            setRemoteStreams(prev => prev.filter(s => s.id !== peerId));
            peerConnections.current.delete(peerId);
        }
    }

    peerConnections.current.set(peerId, pc);
    return pc;
  }, [roomId]);

  useEffect(() => {
    let stream: MediaStream | null;
    let myPeerId: string;
    
    const setup = async () => {
        stream = await initializeLocalStream();
        if (!stream) return;

        myPeerId = `peer_${crypto.randomUUID()}`;
        myPeerIdRef.current = myPeerId;

        const myRef = ref(database, `video-rooms/${roomId}/peers/${myPeerId}`);
        onDisconnect(myRef).remove();
        set(myRef, true);
        
        onValue(ref(database, `video-rooms/${roomId}/peers`), async (snapshot) => {
            const peers = snapshot.val();
            if (peers) {
                for (const peerId in peers) {
                    if (peerId !== myPeerId && !peerConnections.current.has(peerId)) {
                        const pc = createPeerConnection(peerId, stream!);
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        const offerRef = ref(database, `video-rooms/${roomId}/offers/${myPeerId}/${peerId}`);
                        await set(offerRef, { type: 'offer', sdp: offer.sdp });
                    }
                }
            }
        });

        onValue(ref(database, `video-rooms/${roomId}/offers/${myPeerId}`), async (snapshot) => {
            const offers = snapshot.val();
            if(offers) {
                 for (const peerId in offers) {
                     const desc = new RTCSessionDescription(offers[peerId]);
                     const pc = peerConnections.current.get(peerId);
                     if(pc && pc.signalingState === 'have-local-offer') {
                        await pc.setRemoteDescription(desc);
                     }
                 }
            }
        });

        const myOffersRef = ref(database, `video-rooms/${roomId}/offers`);
        onValue(myOffersRef, async (snapshot) => {
            const allOffers = snapshot.val();
            if(allOffers){
                for(const senderId in allOffers){
                    if(allOffers[senderId][myPeerId]){
                        const pc = createPeerConnection(senderId, stream!);
                        await pc.setRemoteDescription(new RTCSessionDescription(allOffers[senderId][myPeerId]));
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);
                        const answerRef = ref(database, `video-rooms/${roomId}/offers/${myPeerId}/${senderId}`);
                        await set(answerRef, { type: 'answer', sdp: answer.sdp });
                    }
                }
            }
        });

        const myIceCandidatesRef = ref(database, `video-rooms/${roomId}/iceCandidates`);
        onValue(myIceCandidatesRef, (snapshot) => {
            const allCandidates = snapshot.val();
            if(allCandidates){
                for(const senderId in allCandidates){
                    if(allCandidates[senderId][myPeerId]){
                        const pc = peerConnections.current.get(senderId);
                        pc?.addIceCandidate(new RTCIceCandidate(allCandidates[senderId][myPeerId]));
                    }
                }
            }
        });

    };
    setup();
    
    return () => {
        off(roomRef);
        leaveRoom();
    };

  }, [roomId, createPeerConnection, initializeLocalStream]);
  
  const leaveRoom = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    setLocalStream(null);
    setRemoteStreams([]);
    if(myPeerIdRef.current) {
        remove(ref(database, `video-rooms/${roomId}/peers/${myPeerIdRef.current}`));
    }
  }, [localStream, roomId]);
  
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMicOn(prev => !prev);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOn(prev => !prev);
    }
  };

  return { localStream, remoteStreams, toggleMic, toggleCamera, leaveRoom, isMicOn, isCameraOn };
};
