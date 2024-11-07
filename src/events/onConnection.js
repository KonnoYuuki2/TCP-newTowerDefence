import onData from './onData.js';
import onEnd from './onEnd.js';
import onError from './onError.js';

const onConnection = (socket) => (data) => {
  try {
    console.log(`client is Connected with ${socket.remoteAddress}:${socket.remotePort}`);

    socket.buffer = Buffer.alloc(0);

    socket.on('data', onData(socket));

    socket.on('end', onEnd(socket));

    socket.on('error', onError(socket));
  } catch (error) {
    console.error(`커넥션 중 에러 발생`);
  }
};

export default onConnection;
