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
    const startedRef = useRef(false);
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

        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
        }

        setLocalStream(null);
        setRemoteStream(null);
    }, [remoteStream]);

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
        startedRef.current = false;
        resetConnection();
        setCallState('idle');
        setErrorMessage('');
    }, [resetConnection]);

    const startCall = useCallback(async () => {
        if (startedRef.current) return;
        startedRef.current = true;

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

            if (state === 'disconnected' || state === 'closed') {
                setCallState('waiting');
            }
        };

        const socket = createSocket();
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
            setCallState('error');
            setErrorMessage(mapRoomErrorMessage(code));
        });

        socket.on('connect_error', () => {
            setCallState('error');
            setErrorMessage('시그널링 서버 연결에 실패했습니다.');
        });

        socket.on('peer-joined', async () => {
            if (role === 'admin') {
                await createAndSendOffer();
            }
        });

        socket.on('webrtc-offer', async ({ sdp }) => {
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
            if (!candidate) return;

            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch {
                // Ignore bad candidates to keep session alive.
            }
        });

        socket.on('peer-left', () => {
            setRemoteStream((prev) => {
                if (prev) {
                    prev.getTracks().forEach((track) => track.stop());
                }
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
