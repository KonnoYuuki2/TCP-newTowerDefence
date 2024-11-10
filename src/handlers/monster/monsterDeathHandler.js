import { PacketType } from '../../constants/header.js';
import { stateSyncNotification } from '../../notifications/syncNotification.js';
import { monsterDeath, monsterDeathUpdateGameState } from '../../utils/monster/monsterUtils.js';
import { oppoSocketWrite } from '../../utils/socket/socketUtils.js';

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
      await monsterDeath(socket, monsterId);
    }, 1500);
  } catch (error) {
    console.error(`몬스터 처치 처리 중 에러 발생: ${error}`);
  }
};
