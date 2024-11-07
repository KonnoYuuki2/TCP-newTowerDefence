import { PacketType } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { spawnMonster } from '../../utils/monster/monsterUtils.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const spawnMonsterRequest = async (socket) => {
  try {
    const { monsterId, monsterNumber } = spawnMonster(socket);
    // 해당 함수에서 socket.id를 받아서 해줌
    const S2CSpawnMonsterResponse = {
      monsterId: monsterId,
      monsterNumber: monsterNumber,
    };
    const gamePacket = {
      spawnMonsterResponse: S2CSpawnMonsterResponse,
    };
    const result = createResponse(PacketType.SPAWN_MONSTER_RESPONSE, 0, gamePacket);
    console.log('Serialized response:', result);
    socket.write(result);
  } catch (error) {
    throw new Error('몬스터 생성 요청중 에러 발생', error);
  }
};

export const enemySpawnMonsterNotification = async (socket, payload) => {
  try {
    const { monsterId, monsterNumber } = payload;
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.packets.GamePacket;

    const S2CSpawnEnemyMonsterNotification = {
      monsterId: monsterId,
      monsterNumber: monsterNumber,
    };
    const packet = {
      spawnEnemyMonsterNotification: S2CSpawnEnemyMonsterNotification,
    };

    return GamePacket.encode(packet).finish();
  } catch (error) {
    throw new Error('상대 몬스터 생성 중 에러 발생', error);
  }
};
