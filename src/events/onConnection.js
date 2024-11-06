import onClose from './onClose.js';
import onData from './onData.js';
import onEnd from './onEnd.js';
import onError from './onError.js';
import { v4 as uuidv4 } from 'uuid';

export const connectedSockets = new Map();

const onConnection = (socket) => {
  try {
    console.log(`client is Connected with ${socket.remoteAddress}:${socket.remotePort}`);
    socket.id = uuidv4();
    connectedSockets.set(socket.id, socket);

    socket.buffer = Buffer.alloc(0);

    socket.on('data', onData(socket));

    socket.on('end', onEnd(socket));

    socket.on('error', onError(socket));

    socket.on('close', onClose(socket, connectedSockets));
  } catch (error) {
    console.error(`커넥션 중 에러 발생`, error);
  }
};

export default onConnection;
