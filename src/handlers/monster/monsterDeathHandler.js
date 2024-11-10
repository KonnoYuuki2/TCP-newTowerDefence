import { PacketType } from '../../constants/header.js';
import { stateSyncNotification } from '../../notifications/syncNotification.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { monsterDeath, monsterDeathUpdateGameState } from '../../utils/monster/monsterUtils.js';
import { oppoSocketWrite } from '../../utils/socket/socketUtils.js';

/**
 * 몬스터 사망 요청시 처리 함수
 * @param {socket, Object}  // socket, payload
 */
export const monsterDeathHandler = async ({ socket, payload }) => {
  try {
    const { monsterId } = payload;

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

    setTimeout(async () => {
      try {
        await monsterDeath(socket, monsterId);
      } catch (error) {
        await handleError(socket, error);
      }
    }, 1500);
  } catch (error) {
    await handleError(socket, error);
  }
};
