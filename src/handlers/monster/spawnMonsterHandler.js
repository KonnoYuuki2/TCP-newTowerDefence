import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { spawnMonster } from '../../utils/monster/monsterUtils.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';

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
