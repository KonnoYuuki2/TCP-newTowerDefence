import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { spawnMonster } from '../../utils/monster/monsterUtils.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const spawnMonsterRequest = async ({ hostsocket, opposocket }) => {
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

    const users = await redis.getUsers(socket.gameId);

    let hostSocketId;
    let oppoSocketId;

    users.forEach((user) => {
      if (user === socket.id) {
        hostSocketId = user;
      } else {
        oppoSocketId = user;
      }
    });

    const hostSocket = connectedSockets.get(hostSocketId);
    const oppoSocket = connectedSockets.get(oppoSocketId);

    hostSocket.write(
      createResponse(
        PacketType.SPAWN_MONSTER_RESPONSE,
        hostSocket.version,
        hostSocket.sequence,
        gamePacket,
      ),
    );
    oppoSocket.write(
      createResponse(
        PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION,
        oppoSocket.version,
        oppoSocket.sequence,
        enemySpawnPacket,
      ),
    );
  } catch (error) {
    console.error(`몬스터 생성 요청중 에러 발생: ${error}`);
  }
};
