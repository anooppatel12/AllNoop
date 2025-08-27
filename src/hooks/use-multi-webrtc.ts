
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getDatabase, ref, onValue, off, remove, set, onDisconnect } from 'firebase/database';
import { getFirebaseApp } from '@/lib/firebase';
import { useToast } from './use-toast';
import { generateSmartNotesAction } from '@/app/actions';
import { GenerateSmartNotesOutput } from '@/ai/flows/generate-smart-notes';
import { useInterval } from './use-interval';


const firebaseApp = getFirebaseApp();
const database = getDatabase(firebaseApp);

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

type RemoteStream = { id: string; stream: MediaStream };
export type SmartNotes = GenerateSmartNotesOutput;
type Message = { sender: string; text: string; timestamp: number };


export const useMultiWebRTC = (roomId: string) => {
  const { toast } = useToast();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const myPeerIdRef = useRef<string | null>(null);
  const dataChannels = useRef<Map<string, RTCDataChannel>>(new Map());
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Chat and Notes state
  const [messages, setMessages] = useState<Message[]>([]);
  const [smartNotes, setSmartNotes] = useState<SmartNotes | null>(null);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const transcriptRef = useRef<string>('');

  const roomRef = ref(database, `video-rooms/${roomId}`);
  const peersRef = ref(database, `video-rooms/${roomId}/peers`);

  const handleDataChannelMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if(data.type === 'chat') {
        setMessages(prev => [...prev, data.payload]);
    }
  }, []);

  const replaceTrack = useCallback((track: MediaStreamTrack | null) => {
    peerConnections.current.forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === track?.kind);
        if (sender) {
            sender.replaceTrack(track);
        }
    });
  }, []);

  const getMedia = useCallback(async (
    videoConstraint: boolean | MediaTrackConstraints,
    audioConstraint: boolean | MediaTrackConstraints = true
  ) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: audioConstraint
        });

        if (localStream) {
            // Stop only the tracks, not the whole stream object
            localStream.getTracks().forEach(track => track.stop());
        }
        
        setLocalStream(stream);
        
        // If peer connections exist, replace tracks
        if (peerConnections.current.size > 0) {
            stream.getTracks().forEach(track => {
                replaceTrack(track);
            });
        }
        
        return stream;

    } catch(error) {
        console.error("Error accessing media devices:", error);
        toast({
          variant: 'destructive',
          title: 'Camera/Mic Access Denied',
          description: 'Please enable permissions to use the video room.',
        });
        throw error; // re-throw to be caught by callers
    }
  }, [localStream, replaceTrack, toast]);

 const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen share and revert to camera
      await getMedia({ facingMode });
      setIsScreenSharing(false);
    } else {
      try {
        // Start screen share
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        setIsScreenSharing(true);
        
        const screenVideoTrack = screenStream.getVideoTracks()[0];

        if (localStream) {
            const oldVideoTrack = localStream.getVideoTracks()[0];
            localStream.removeTrack(oldVideoTrack);
            oldVideoTrack.stop();
            localStream.addTrack(screenVideoTrack);
            replaceTrack(screenVideoTrack);
        }
        
        // When screen sharing ends (e.g., user clicks browser's stop sharing button)
        screenVideoTrack.onended = () => {
          if(isScreenSharing) { // check if it was us who stopped it
            getMedia({facingMode});
            setIsScreenSharing(false);
          }
        };
      } catch (err) {
        console.error("Screen share failed:", err);
        toast({
          variant: "destructive",
          title: "Screen Share Failed",
          description: "Could not start screen sharing. Please check browser permissions."
        })
      }
    }
  }, [isScreenSharing, getMedia, localStream, replaceTrack, facingMode, toast]);

  const flipCamera = useCallback(async () => {
    if (isScreenSharing || !localStream) return;

    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    const oldVideoTrack = localStream.getVideoTracks()[0];
    
    // Stop the current video track before requesting a new one
    if(oldVideoTrack) oldVideoTrack.stop();
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newFacingMode } });
        const newVideoTrack = stream.getVideoTracks()[0];
        
        // Replace the old track with the new one in the local stream
        if(oldVideoTrack) localStream.removeTrack(oldVideoTrack);
        localStream.addTrack(newVideoTrack);

        // Update the track for all peer connections
        replaceTrack(newVideoTrack);
        
        setFacingMode(newFacingMode);
    } catch (err) {
         console.error("Error flipping camera:", err);
         toast({
            variant: "destructive",
            title: "Camera Flip Failed",
            description: "Could not switch cameras. Please ensure you have another camera available and have granted permissions."
         });
         // Attempt to restore the old stream
         getMedia({ facingMode });
    }
  }, [isScreenSharing, localStream, facingMode, replaceTrack, toast, getMedia]);


  const createPeerConnection = useCallback((peerId: string, stream: MediaStream) => {
    if (peerConnections.current.has(peerId)) {
        return peerConnections.current.get(peerId)!;
    }
    const pc = new RTCPeerConnection(configuration);

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = event => {
      if (event.candidate && myPeerIdRef.current) {
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
    
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = handleDataChannelMessage;
      dataChannels.current.set(peerId, channel);
    };
    
    pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed' || pc.connectionState === 'failed') {
            setRemoteStreams(prev => prev.filter(s => s.id !== peerId));
            peerConnections.current.delete(peerId);
            dataChannels.current.delete(peerId);
        }
    }

    peerConnections.current.set(peerId, pc);
    return pc;
  }, [roomId, handleDataChannelMessage]);

  const leaveRoom = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    setLocalStream(null);
    setRemoteStreams([]);
    if(myPeerIdRef.current) {
        const myPeerInPeersRef = ref(database, `video-rooms/${roomId}/peers/${myPeerIdRef.current}`);
        remove(myPeerInPeersRef);
    }
  }, [localStream, roomId]);

  // Request media permissions on mount
  useEffect(() => {
    getMedia({ facingMode: 'user' }).catch(error => {
        console.error("Error on initial media access:", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  useEffect(() => {
    if (!localStream) return;

    const myPeerId = `peer_${crypto.randomUUID()}`;
    myPeerIdRef.current = myPeerId;

    const myRef = ref(database, `video-rooms/${roomId}/peers/${myPeerId}`);
    const disconnectHandler = onDisconnect(myRef);
    disconnectHandler.remove();
    set(myRef, { name: `User-${myPeerId.substring(5, 9)}` });

    const setupSignaling = async () => {
      onValue(peersRef, async (snapshot) => {
        const peers = snapshot.val();
        if (peers) {
          for (const peerId in peers) {
            if (peerId !== myPeerIdRef.current && !peerConnections.current.has(peerId)) {
              const pc = createPeerConnection(peerId, localStream);
              const channel = pc.createDataChannel('chat');
              channel.onmessage = handleDataChannelMessage;
              dataChannels.current.set(peerId, channel);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              const offerRef = ref(database, `video-rooms/${roomId}/offers/${myPeerId}/${peerId}`);
              set(offerRef, { type: 'offer', sdp: offer.sdp });
            }
          }
        }
      });
      
      const offersRef = ref(database, `video-rooms/${roomId}/offers`);
      onValue(offersRef, async (snapshot) => {
        const allOffers = snapshot.val();
        if (allOffers) {
          // Listen for answers to my offers
          if(allOffers[myPeerId]){
            for(const peerId in allOffers[myPeerId]) {
              if (allOffers[myPeerId][peerId]?.type === 'answer') {
                 const pc = peerConnections.current.get(peerId);
                 if (pc && pc.signalingState === 'have-local-offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(allOffers[myPeerId][peerId]));
                 }
              }
            }
          }

          // Listen for offers from others
          for(const senderId in allOffers) {
            if(senderId !== myPeerIdRef.current && allOffers[senderId][myPeerId] && allOffers[senderId][myPeerId].type === 'offer') {
              const pc = createPeerConnection(senderId, localStream);
              if (pc.signalingState === 'stable') {
                await pc.setRemoteDescription(new RTCSessionDescription(allOffers[senderId][myPeerId]));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                const answerRef = ref(database, `video-rooms/${roomId}/offers/${senderId}/${myPeerId}`);
                set(answerRef, { type: 'answer', sdp: answer.sdp });
              }
            }
          }
        }
      });

      const iceCandidatesRef = ref(database, `video-rooms/${roomId}/iceCandidates`);
      onValue(iceCandidatesRef, (snapshot) => {
        const allCandidates = snapshot.val();
        if (allCandidates) {
          for (const senderId in allCandidates) {
            if(senderId !== myPeerIdRef.current && peerConnections.current.has(senderId) && allCandidates[senderId][myPeerIdRef.current]) {
                const pc = peerConnections.current.get(senderId);
                pc?.addIceCandidate(new RTCIceCandidate(allCandidates[senderId][myPeerIdRef.current])).catch(() => {});
            }
          }
        }
      });

       const notesRef = ref(database, `video-rooms/${roomId}/smartNotes`);
        onValue(notesRef, (snapshot) => {
            setSmartNotes(snapshot.val());
        });
    };

    setupSignaling();

    const handleBeforeUnload = () => {
      leaveRoom();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      off(peersRef);
      off(ref(database, `video-rooms/${roomId}/offers`));
      off(ref(database, `video-rooms/${roomId}/iceCandidates`));
      off(ref(database, `video-rooms/${roomId}/smartNotes`));
    };
  }, [localStream, roomId, createPeerConnection, handleDataChannelMessage, leaveRoom]);
  
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
  
  const sendMessage = useCallback((text: string) => {
    const message = {
        type: 'chat',
        payload: {
            sender: `User-${myPeerIdRef.current?.substring(5, 9)}`,
            text,
            timestamp: Date.now()
        }
    };
    dataChannels.current.forEach(channel => {
      if(channel.readyState === 'open') {
        channel.send(JSON.stringify(message));
      }
    });
    // Also add to own messages
    setMessages(prev => [...prev, message.payload]);
  }, []);
  
  const generateNotesPeriodically = useCallback(async () => {
    const fullTranscript = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
    
    if(fullTranscript.length > transcriptRef.current.length + 50) { // Only generate if there's enough new text
        setIsGeneratingNotes(true);
        transcriptRef.current = fullTranscript;
        const result = await generateSmartNotesAction({ transcript: fullTranscript });
        if(!result.error && result.notes) {
           const notesRefDb = ref(database, `video-rooms/${roomId}/smartNotes`);
           set(notesRefDb, result.notes);
        }
        setIsGeneratingNotes(false);
    }

  }, [messages, roomId]);

  useInterval(generateNotesPeriodically, 15000); // every 15 seconds

  return { localStream, remoteStreams, toggleMic, toggleCamera, leaveRoom, isMicOn, isCameraOn, sendMessage, messages, smartNotes, isGeneratingNotes, toggleScreenShare, isScreenSharing, flipCamera };
};
