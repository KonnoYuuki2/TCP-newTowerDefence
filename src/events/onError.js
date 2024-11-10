import { deleteData } from '../utils/redis/redis.js';

const onError = (socket) => async (error) => {
  try {
    console.error(`소켓 에러 발생`, error);
    setTimeout(async () => {
      // 게임 세션 및 유저 데이터 삭제
      try {
        await deleteData(socket);
      } catch (error) {
        console.error(`데이터 삭제 중 에러 발생`, error);
      }
    }, 2000);
  } catch (error) {
    console.error(`onError 처리 중 에러 발생`, error);
  }
};

export default onError;
