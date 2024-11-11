import { deleteData, redis } from '../utils/redis/redis.js';

const onEnd = (socket) => async (data) => {
  try {
    // 일단 아이디만 삭제
    await redis.removeUser(socket.gameId, socket.id);

    setTimeout(async () => {
      // 게임 세션 및 유저 데이터 삭제
      try {
        await deleteData(socket);
      } catch (error) {
        console.error(`데이터 삭제 중 에러 발생`, error);
      }
    }, 2000);
  } catch (error) {
    console.error(`연결 종료 중 에러 발생`, error);
  }
};

export default onEnd;
