import { getProtoMessages } from '../../../init/loadProtos.js';

export const createSpawnMonsterSocket = (monsterId, monsterNumber) => {
  const protoMessages = getProtoMessages();
  const spawnMonsterProto = protoMessages.packets.GamePacket;

  const payload = { monsterId, monsterNumber };

  const message = spawnMonsterProto.create(payload);

  const createSpawnMonsterPacket = spawnMonsterProto.encode(message).finish();

  return createSpawnMonsterPacket;
};

export const createDeathMonsterSocket = (monsterId) => {
  const protoMessages = getProtoMessages();
  const MonsterDeathProto = protoMessages.packets.GamePacket;

  const payload = { monsterId };

  const message = MonsterDeathProto.create(payload);

  const MonsterDeathPacket = MonsterDeathProto.encode(message).finish();

  return MonsterDeathPacket
};
