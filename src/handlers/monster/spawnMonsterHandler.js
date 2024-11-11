import { PacketType } from '../../constants/header.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { spawnMonster } from '../../utils/monster/monsterUtils.js';
import { hostSocketWrite, oppoSocketWrite } from '../../utils/socket/socketUtils.js';

/**
 * 몬스터 스폰 요청시 처리 함수
 * @param {socket, Object} // socket, payload
 */
export const spawnMonsterRequest = async ({ socket, payload }) => {
  try {
    const { monsterId, monsterNumber } = await spawnMonster(hostsocket);

    const SpawnMonster = {
      monsterId: monsterId,
      monsterNumber: monsterNumber,
    };

    // spawnMonsterResponse 패킷
    const gamePacket = {
      spawnMonsterResponse: SpawnMonster,
    };

    // spawnEnemyMonsterNotification 패킷
    const enemySpawnPacket = {
      spawnEnemyMonsterNotification: SpawnMonster,
    };

    await hostSocketWrite(socket, PacketType.SPAWN_MONSTER_RESPONSE, gamePacket);
    await oppoSocketWrite(socket, PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION, enemySpawnPacket);
  } catch (error) {
    await handleError(socket, error);
  }
};
