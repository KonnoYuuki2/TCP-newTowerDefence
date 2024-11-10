import { PacketType } from '../../constants/header.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { spawnMonster } from '../../utils/monster/monsterUtils.js';
import { hostSocketWrite, oppoSocketWrite } from '../../utils/socket/socketUtils.js';

export const spawnMonsterRequest = async ({ socket, payload }) => {
  try {
    const { monsterId, monsterNumber } = await spawnMonster(socket);

    // 해당 함수에서 socket.id를 받아서 해줌
    const S2CSpawnMonsterResponse = {
      monsterId: monsterId,
      monsterNumber: monsterNumber,
    };
    const gamePacket = {
      spawnMonsterResponse: S2CSpawnMonsterResponse,
    };

    // enemySpawnNotfication 패킷
    const enemySpawnPacket = {
      spawnEnemyMonsterNotification: { monsterId: monsterId, monsterNumber: monsterNumber },
    };

    await hostSocketWrite(socket, PacketType.SPAWN_MONSTER_RESPONSE, gamePacket);
    await oppoSocketWrite(socket, PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION, enemySpawnPacket);
  } catch (error) {
    await handleError(socket, error);
  }
};
