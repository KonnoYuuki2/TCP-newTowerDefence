import { PacketType } from '../../../constants/header.js';
import { getProtoMessages } from '../../../init/loadProtos.js';
import { maketNotificationPacket } from '../../notification/notification.js';

export const createS2CEnemyMonsterDeathNotification = (monsterId) => {
  const protoMessages = getProtoMessages();
  const enemyMonsterDeathProto = protoMessages.packets.S2CEnemyMonsterDeathNotification;

  const payload = { monsterId };

  const message = enemyMonsterDeathProto.create(payload);

  const enemyMonsterDeathPacket = enemyMonsterDeathProto.encode(message).finish();

  return maketNotificationPacket(
    enemyMonsterDeathPacket,
    PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION,
  );
};
