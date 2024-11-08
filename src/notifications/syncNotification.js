import HANDLER_IDS from '../constants/handlerIds.js';
import { redis } from '../utils/redis/redis.js';
import { createResponse } from '../utils/response/createResponse.js';

/**
 * 상태 동기화 패킷을 생성하는 함수
 * @param {Socket} socket
 * @returns {Buffer} 상태 동기화 패킷
 */
export const stateSyncNotification = async (socket) => {
  try {
    const userData = await redis.getUserData(socket.id);

    const S2CStateSyncNotification = {
      userGold: userData.userGold,
      baseHp: userData.baseHp,
      monsterLevel: userData.monsterLevel,
      score: userData.score,
      towers: userData.towers,
      monsters: userData.monsters,
    };

    const gamePacket = {
      stateSyncNotification: S2CStateSyncNotification,
    };
    console.log(gamePacket);

    const buffer = createResponse(
      HANDLER_IDS.STATE_SYNC_NOTIFICATION,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    return buffer;
  } catch (error) {
    console.error(`상태 동기화 패킷 생성 중 에러 발생: ${error}`);
  }
};
