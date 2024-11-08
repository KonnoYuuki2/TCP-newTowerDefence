import HANDLER_IDS from '../constants/handlerIds.js';
import { redis } from '../utils/redis/redis.js';
import { createResponse } from '../utils/response/createResponse.js';

export const stateSyncNotification = async (socket) => {
  const userData = await redis.getUserData(socket.id);

  const S2CStateSyncNotification = {
    userGold: userData.userGold,
    baseHp: userData.baseHp,
    monsterLevel: userData.monsterLevel,
    score: userData.score,
    towerData: userData.towerData,
    monsterData: userData.monsterData,
  };

  const gamePacket = {
    stateSyncNotification: S2CStateSyncNotification,
  };

  const buffer = createResponse(HANDLER_IDS.STATE_SYNC_NOTIFICATION, 0, gamePacket);

  return buffer;
};
