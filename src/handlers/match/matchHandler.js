import { matchQueue } from '../queues/matchQueue.js';

export const matchRequestHandler = async (socket, payload) => {
  try {
    const player = {
      id: '1', // 임시값
      socket: socket,
    };

    // 매칭 큐에 플레이어 추가
    await matchQueue.add('match', player, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    console.log(`플레이어 ${player.id} 매칭 큐 진입`);
  } catch (error) {
    console.error('매칭 요청 처리 중 오류 발생:', error);
    throw error;
  }
};
