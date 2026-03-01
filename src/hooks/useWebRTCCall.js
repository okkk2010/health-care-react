import { useCallback, useRef, useState } from 'react';
import storageService from '../services/storage';
import { createSocket } from '../services/socket';

const ICE_SERVERS = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const mapRoomErrorMessage = (code) => {
    if (code === 'ROOM_FULL') return '이미 통화 인원이 가득 찼습니다.';
    if (code === 'ROLE_DUPLICATE') return '같은 역할로 이미 접속 중입니다.';
    return '잘못된 접속 정보입니다.';
};

export const useWebRTCCall = ({ role, appointmentCode }) => {
    const [callState, setCallState] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const socketRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const startedRef = useRef(false);
    const callAttemptIdRef = useRef(0);
    const userIdRef = useRef(storageService.getEmail() || `${role}-${Date.now()}`);

    const resetConnection = useCallback(() => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.onconnectionstatechange = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }

        if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach((track) => track.stop());
            remoteStreamRef.current = null;
        }

        setLocalStream(null);
        setRemoteStream(null);
    }, []);

    const createAndSendOffer = useCallback(async () => {
        const pc = peerConnectionRef.current;
        const socket = socketRef.current;

        if (!pc || !socket) return;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc-offer', {
            roomId: appointmentCode,
            sdp: offer,
            fromUserId: userIdRef.current,
        });
        setCallState('connecting');
    }, [appointmentCode]);

    const leaveCall = useCallback(() => {
        callAttemptIdRef.current += 1;
        startedRef.current = false;
        resetConnection();
        setCallState('idle');
        setErrorMessage('');
    }, [resetConnection]);

    const startCall = useCallback(async () => {
        if (startedRef.current) return;
        startedRef.current = true;
        const callAttemptId = ++callAttemptIdRef.current;

        if (!appointmentCode) {
            setCallState('error');
            setErrorMessage('잘못된 접속 정보입니다.');
            return;
        }

        if (role !== 'admin' && role !== 'visitor') {
            setCallState('error');
            setErrorMessage('잘못된 접속 정보입니다.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            if (callAttemptIdRef.current !== callAttemptId || !startedRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }
            localStreamRef.current = stream;
            setLocalStream(stream);
        } catch (error) {
            setCallState('error');
            if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
                setErrorMessage('카메라/마이크 권한을 허용해주세요.');
            } else {
                setErrorMessage('카메라 또는 마이크를 사용할 수 없습니다.');
            }
            startedRef.current = false;
            return;
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current);
        });

        pc.ontrack = (event) => {
            const [stream] = event.streams;
            if (stream) {
                remoteStreamRef.current = stream;
                setRemoteStream(stream);
                setCallState('connected');
            }
        };

        pc.onconnectionstatechange = () => {
            const state = pc.connectionState;
            if (state === 'connected') {
                setCallState('connected');
                return;
            }

            if (state === 'failed') {
                setCallState('error');
                setErrorMessage('연결 중 오류가 발생했습니다.');
                return;
            }

            if (state === 'disconnected') {
                setCallState('connecting');
                return;
            }

            if (state === 'closed') {
                setCallState('waiting');
            }
        };

        const socket = createSocket();
        if (callAttemptIdRef.current !== callAttemptId || !startedRef.current) {
            socket.disconnect();
            return;
        }
        socketRef.current = socket;

        pc.onicecandidate = (event) => {
            if (!event.candidate || !socketRef.current) return;

            socketRef.current.emit('webrtc-ice-candidate', {
                roomId: appointmentCode,
                candidate: event.candidate,
                fromUserId: userIdRef.current,
            });
        };

        socket.on('room-error', ({ code }) => {
            if (callAttemptIdRef.current !== callAttemptId) return;
            setCallState('error');
            setErrorMessage(mapRoomErrorMessage(code));
        });

        socket.on('connect_error', () => {
            if (callAttemptIdRef.current !== callAttemptId) return;
            setCallState('error');
            setErrorMessage('시그널링 서버 연결에 실패했습니다.');
        });

        socket.on('peer-joined', async () => {
            if (callAttemptIdRef.current !== callAttemptId) return;
            if (role === 'admin') {
                await createAndSendOffer();
            }
        });

        socket.on('webrtc-offer', async ({ sdp }) => {
            if (callAttemptIdRef.current !== callAttemptId) return;
            if (role !== 'visitor') return;

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.emit('webrtc-answer', {
                    roomId: appointmentCode,
                    sdp: answer,
                    fromUserId: userIdRef.current,
                });
                setCallState('connecting');
            } catch {
                setCallState('error');
                setErrorMessage('연결 중 오류가 발생했습니다.');
            }
        });

        socket.on('webrtc-answer', async ({ sdp }) => {
            if (callAttemptIdRef.current !== callAttemptId) return;
            if (role !== 'admin') return;

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                setCallState('connecting');
            } catch {
                setCallState('error');
                setErrorMessage('연결 중 오류가 발생했습니다.');
            }
        });

        socket.on('webrtc-ice-candidate', async ({ candidate }) => {
            if (callAttemptIdRef.current !== callAttemptId) return;
            if (!candidate) return;

            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch {
                // Ignore bad candidates to keep session alive.
            }
        });

        socket.on('peer-left', () => {
            if (callAttemptIdRef.current !== callAttemptId) return;
            setRemoteStream((prev) => {
                if (prev) {
                    prev.getTracks().forEach((track) => track.stop());
                }
                remoteStreamRef.current = null;
                return null;
            });
            setCallState('waiting');
        });

        socket.emit(
            'join-room',
            {
                roomId: appointmentCode,
                role,
                userId: userIdRef.current,
            },
            async (ack) => {
                if (callAttemptIdRef.current !== callAttemptId) return;
                if (!ack?.ok) {
                    setCallState('error');
                    setErrorMessage(mapRoomErrorMessage(ack?.code));
                    return;
                }

                setCallState('waiting');

                if (role === 'admin' && ack.count === 2) {
                    await createAndSendOffer();
                }
            }
        );
    }, [appointmentCode, createAndSendOffer, role]);

    return {
        callState,
        errorMessage,
        localStream,
        remoteStream,
        startCall,
        leaveCall,
    };
};

let mediaRecorder;
let chunks = [];
let mixedAudioStream;
let recordingAudioContext;

const cleanupRecorderResources = () => {
    if (mixedAudioStream) {
        mixedAudioStream.getTracks().forEach((track) => track.stop());
        mixedAudioStream = null;
    }

    if (recordingAudioContext) {
        recordingAudioContext.close();
        recordingAudioContext = null;
    }

    mediaRecorder = null;
};

export const startCallRecording = (localStream, remoteStream) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        return false;
    }

    const localAudioTrack = localStream?.getAudioTracks?.()[0] ?? null;
    const remoteAudioTrack = remoteStream?.getAudioTracks?.()[0] ?? null;

    if (!localAudioTrack && !remoteAudioTrack) {
        return false;
    }

    recordingAudioContext = new AudioContext();
    const dest = recordingAudioContext.createMediaStreamDestination();

    if (localAudioTrack) {
        const localSource = recordingAudioContext.createMediaStreamSource(
            new MediaStream([localAudioTrack])
        );
        localSource.connect(dest);
    }
    
    if (remoteAudioTrack) {
        const remoteSource = recordingAudioContext.createMediaStreamSource(
            new MediaStream([remoteAudioTrack])
        );
        remoteSource.connect(dest);
    }

    mixedAudioStream = new MediaStream([...dest.stream.getAudioTracks()]);

    if (!mixedAudioStream.getAudioTracks().length) {
        cleanupRecorderResources();
        return false;
    }

    mediaRecorder = MediaRecorder.isTypeSupported('audio/webm')
        ? new MediaRecorder(mixedAudioStream, { mimeType: 'audio/webm' })
        : new MediaRecorder(mixedAudioStream);
    chunks = [];

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.start(1000);
    return true;
};

export const stopCallRecording = () => {
    return new Promise((resolve) => {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            cleanupRecorderResources();
            resolve(null);
            return;
        }

        mediaRecorder.onstop = () => {
            const blob = chunks.length ? new Blob(chunks, { type: 'audio/webm' }) : null;
            chunks = [];
            cleanupRecorderResources();
            resolve(blob);
        };

        mediaRecorder.stop();
    });
};
