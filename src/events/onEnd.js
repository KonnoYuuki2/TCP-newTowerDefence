import { deleteData } from '../utils/redis/redis.js';

const onEnd = (socket) => async (data) => {
  try {
    // 게임 세션 및 유저 데이터 삭제
    await deleteData(socket);
  } catch (error) {
    console.error(`연결 종료 중 에러 발생`, error);
  }
};

export default onEnd;
