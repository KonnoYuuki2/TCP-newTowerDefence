import { matchQueue } from '../queues/matchQueue.js';
import { v4 as uuidv4 } from 'uuid';

export const matchRequestHandler = async (socket, payload) => {
  try {
    // db에서 uuid를 가져오는 쿼리로 수정 필요
    // socket.id = await getUserUuid();
    socket.id = uuidv4();
    const player = {
      id: socket.id,
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
  }
};
