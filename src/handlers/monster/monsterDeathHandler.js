import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { stateSyncNotification } from '../../notifications/syncNotification.js';
import { monsterDeath, monsterDeathUpdateGameState } from '../../utils/monster/monsterUtils.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { oppoSocketWrite } from '../../utils/socket/socketUtils.js';

export const monsterDeathHandler = async ({ socket, payload }) => {
  try {
    const { monsterId } = payload;

    // await monsterDeath(socket, monsterId);

    await monsterDeathUpdateGameState(socket);

    const S2CEnemyMonsterDeathNotification = {
      monsterId: monsterId,
    };
    const gamePacket = {
      enemyMonsterDeathNotification: S2CEnemyMonsterDeathNotification,
    };

    await oppoSocketWrite(socket, PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION, gamePacket);
    const buffer = await stateSyncNotification(socket);
    socket.write(buffer);

    await monsterDeath(socket, monsterId);
  } catch (error) {
    console.error(`몬스터 처치 처리 중 에러 발생: ${error}`);
  }
};
