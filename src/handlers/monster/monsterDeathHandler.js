import { getProtoMessages } from '../../init/loadProtos.js';
import { monsterDeath } from '../../utils/monster/monsterUtils.js';

export const monsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;
    monsterDeath(socket, monsterId);

    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.packets.GamePacket;

    const C2SMonsterDeathNotification = {
      monsterId: monsterId,
    };
    const packet = {
      monsterDeathNotification: C2SMonsterDeathNotification,
    };

    return GamePacket.encode(packet).finish();
  } catch (error) {
    throw new Error('몬스터  에러 발생', error);
  }
};

export const enemyMonsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;

    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.packets.GamePacket;

    const S2CEnemyMonsterDeathNotification = {
      monsterId: monsterId,
    };
    const packet = {
      enemyMonsterDeathNotification: S2CEnemyMonsterDeathNotification
    }
    
    return GamePacket.encode(packet).finish();
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};
