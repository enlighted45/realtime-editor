import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity, // Fixed typo: reconnectionAttempt -> reconnectionAttempts
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(import.meta.env.VITE_BACKEND_URL, options);
};
