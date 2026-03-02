import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = 4000;
const CLIENT_ORIGIN = 'http://localhost:5173';
const ALLOWED_ORIGINS = new Set([
    CLIENT_ORIGIN,
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
]);

const corsOrigin = (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
        callback(null, true);
        return;
    }
    callback(new Error(`Origin not allowed: ${origin}`));
};

const app = express();
app.use(cors({ origin: corsOrigin, credentials: true }));
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const roomMeta = {};

const getRoomCount = (meta) => {
    let count = 0;
    if (meta.adminSocketId) count += 1;
    if (meta.visitorSocketId) count += 1;
    return count;
};

const findPeerSocketId = (meta, role) => {
    if (!meta) return null;
    return role === 'admin' ? meta.visitorSocketId : meta.adminSocketId;
};

const emitToPeer = (socket, roomId, eventName, payload) => {
    const room = roomMeta[roomId];
    if (!room) return;

    const role = socket.data?.role;
    const peerSocketId = findPeerSocketId(room, role);
    if (!peerSocketId) return;

    io.to(peerSocketId).emit(eventName, payload);
};

io.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, role, userId }, ack) => {
        if (!roomId || !['admin', 'visitor'].includes(role)) {
            const response = { ok: false, code: 'INVALID_JOIN', message: 'Invalid join payload' };
            if (typeof ack === 'function') ack(response);
            socket.emit('room-error', response);
            return;
        }

        const currentMeta = roomMeta[roomId] ?? { adminSocketId: null, visitorSocketId: null };

        if (getRoomCount(currentMeta) >= 2) {
            const response = { ok: false, code: 'ROOM_FULL', message: 'Room is full' };
            if (typeof ack === 'function') ack(response);
            socket.emit('room-error', response);
            return;
        }

        if (role === 'admin' && currentMeta.adminSocketId) {
            const response = { ok: false, code: 'ROLE_DUPLICATE', message: 'Admin already joined' };
            if (typeof ack === 'function') ack(response);
            socket.emit('room-error', response);
            return;
        }

        if (role === 'visitor' && currentMeta.visitorSocketId) {
            const response = { ok: false, code: 'ROLE_DUPLICATE', message: 'Visitor already joined' };
            if (typeof ack === 'function') ack(response);
            socket.emit('room-error', response);
            return;
        }

        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.role = role;
        socket.data.userId = userId;

        if (role === 'admin') currentMeta.adminSocketId = socket.id;
        if (role === 'visitor') currentMeta.visitorSocketId = socket.id;

        roomMeta[roomId] = currentMeta;

        const joinedCount = getRoomCount(currentMeta);
        if (typeof ack === 'function') {
            ack({ ok: true, roomId, role, count: joinedCount });
        }

        socket.to(roomId).emit('peer-joined', { roomId, role, userId });
    });

    socket.on('webrtc-offer', (payload) => {
        emitToPeer(socket, payload?.roomId, 'webrtc-offer', payload);
    });

    socket.on('webrtc-answer', (payload) => {
        emitToPeer(socket, payload?.roomId, 'webrtc-answer', payload);
    });

    socket.on('webrtc-ice-candidate', (payload) => {
        emitToPeer(socket, payload?.roomId, 'webrtc-ice-candidate', payload);
    });

    socket.on('disconnect', () => {
        const roomId = socket.data?.roomId;
        const role = socket.data?.role;
        const userId = socket.data?.userId;

        if (!roomId || !role || !roomMeta[roomId]) return;

        if (role === 'admin' && roomMeta[roomId].adminSocketId === socket.id) {
            roomMeta[roomId].adminSocketId = null;
        }

        if (role === 'visitor' && roomMeta[roomId].visitorSocketId === socket.id) {
            roomMeta[roomId].visitorSocketId = null;
        }

        socket.to(roomId).emit('peer-left', { roomId, userId });

        if (!roomMeta[roomId].adminSocketId && !roomMeta[roomId].visitorSocketId) {
            delete roomMeta[roomId];
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Signaling server is running on http://localhost:${PORT}`);
});
