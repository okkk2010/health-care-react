import { io } from 'socket.io-client';

const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL || 'http://localhost:4000';

export const createSocket = () => {
    return io(SIGNALING_URL, {
        transports: ['websocket'],
    });
};
