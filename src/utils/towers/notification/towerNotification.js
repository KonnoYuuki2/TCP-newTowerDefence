import { PacketType } from '../../../constants/header.js';
import { getProtoMessages } from '../../../init/loadProtos.js';
import { maketNotificationPacket } from '../../notification/notification.js';

export const createS2CEnemyTowerAttackNotification = (towerId, monsterId) => {
  const protoMessages = getProtoMessages();
  const enemyTowerAttackProto = protoMessages.packets.S2CEnemyTowerAttackNotification;

  const payload = { towerId, monsterId };

  const message = enemyTowerAttackProto.create(payload);

  const enemyTowerAttackpacket = enemyTowerAttackProto.encode(message).finish();

  return maketNotificationPacket(
    enemyTowerAttackpacket,
    PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION,
  );
};
