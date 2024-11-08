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

    let enemyUser;
    let socketUser;

    users.forEach((user) => {
      if (user === socket.id) {
        socketUser = user;
      } else {
        enemyUser = user;
      }
    });

    // 각 유저의 소켓마다 다른 패킷 전송
    connectedSockets.forEach((value, key) => {
      if (key === socketUser) {
        value.write(createResponse(PacketType.SPAWN_MONSTER_RESPONSE, 0, gamePacket));
      } else if (key === enemyUser) {
        value.write(
          createResponse(PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION, 0, enemySpawnPacket),
        );
      }
    });
  } catch (error) {
    throw new Error('몬스터 생성 요청중 에러 발생', error);
  }
};

// export const enemySpawnMonsterNotification = async ({ socket, payload }) => {
//   try {
//     const { monsterId, monsterNumber } = payload;
//     const protoMessages = getProtoMessages();
//     const GamePacket = protoMessages.packets.GamePacket;

//     const S2CSpawnEnemyMonsterNotification = {
//       monsterId: monsterId,
//       monsterNumber: monsterNumber,
//     };
//     const packet = {
//       spawnEnemyMonsterNotification: S2CSpawnEnemyMonsterNotification,
//     };

//     return GamePacket.encode(packet).finish();
//   } catch (error) {
//     throw new Error('상대 몬스터 생성 중 에러 발생', error);
//   }
// };
