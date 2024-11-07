import { PacketType } from '../../../constants/header.js';
import { maketNotificationPacket } from '../../../notifications/notification.js';
import { createDeathMonsterSocket, createSpawnMonsterSocket } from './createSocketUtil.js';

export const createS2CSpawnMonsterNotification = (monsterId, mosnsterNumber) => {
  const createSpawnMonsterPacket = createSpawnMonsterSocket(monsterId, mosnsterNumber);

  return maketNotificationPacket(createSpawnMonsterPacket, PacketType.SPAWN_MONSTER_RESPONSE);
};

export const createS2CEnemySpawnMonsterNotification = (monsterId, mosnsterNumber) => {
  const createSpawnMonsterPacket = createSpawnMonsterSocket(monsterId, mosnsterNumber);

  return maketNotificationPacket(
    createSpawnMonsterPacket,
    PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION,
  );
};

export const createS2CEnemyMonsterDeathNotification = (monsterId) => {
  const enemyMonsterDeathPacket = createDeathMonsterSocket(monsterId);

  return maketNotificationPacket(
    enemyMonsterDeathPacket,
    PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION,
  );
};

// export const createS2CMonsterDeathNotification = (monsterId) => {
//   const protoMessages = getProtoMessages();
//   const enemyMonsterDeathProto = protoMessages.packets.S2CEnemyMonsterDeathNotification;

//   const payload = { monsterId };

//   const message = enemyMonsterDeathProto.create(payload);

//   const enemyMonsterDeathPacket = enemyMonsterDeathProto.encode(message).finish();

//   return maketNotificationPacket(
//     enemyMonsterDeathPacket,
//     PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION,
//   );
// };
