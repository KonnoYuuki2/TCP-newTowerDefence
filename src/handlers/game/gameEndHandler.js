import { deleteData } from '../../utils/redis/redis.js';

export const gameEndHandler = async ({ socket, payload }) => {
  try {
    // 게임 세션 및 유저 데이터 삭제
    await deleteData(socket);
  } catch (error) {
    console.error('게임 종료 처리 중 오류 발생:', error);
  }
};
