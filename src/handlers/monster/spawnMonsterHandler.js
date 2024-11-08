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

    hostsocket.write(createResponse(PacketType.SPAWN_MONSTER_RESPONSE, 0, gamePacket));
    opposocket.write(
      createResponse(PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION, 0, enemySpawnPacket),
    );
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
