import { deleteData } from '../utils/redis/redis.js';

const onClose = (socket, connectedSockets) => async () => {
  try {
    connectedSockets.delete(socket.id);

    // 게임 세션 및 유저 데이터 삭제
    await deleteData(socket);
  } catch (error) {
    console.error(`소켓 종료 중 에러 발생`, error);
  }
};

export default onClose;
