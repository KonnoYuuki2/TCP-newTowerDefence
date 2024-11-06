import { PacketType } from '../../../constants/header.js';
import { getProtoMessages } from '../../../init/loadProtos.js';
import { createResponse } from '../../response/createResponse.js';

export const createS2CEnemyTowerAttackNotification = async (packet) => {
  const protoMessages = getProtoMessages();

  const enemyTowerAttackProto = protoMessages.packets.GamePacket;

  const message = enemyTowerAttackProto.create(packet);

  const enemyTowerAttackpacket = enemyTowerAttackProto.encode(message).finish();

  return createResponse(PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION, 0, enemyTowerAttackpacket);
};
