import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { createS2CEnemyMonsterDeathNotification } from '../../utils/monster/monsterNotification/monsterNotification.js';
import { monsterDeath } from '../../utils/monster/monsterUtils.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const monsterDeathHandler = async ({ socket, payload }) => {
  try {
    const { monsterId } = payload;
    monsterDeath(socket, monsterId);

    const S2CMonsterDeathNotification = {
      monsterId: monsterId,
    };
    const gamePacket = {
      monsterDeathNotification: S2CMonsterDeathNotification,
    };

    let enemySocket;

    for (const key of connectedSockets.keys()) {
      if (key !== socket.id) {
        enemySocket = connectedSockets.get(key);
        break; // 첫 번째 다른 소켓을 찾았으므로 반복을 중단
      }
    }

    enemySocket.write(createResponse(PacketType.MONSTER_DEATH_NOTIFICATION, 0, gamePacket));
    // 여기 어떤 값을 적어야 하는지 잘 모르겠음
  } catch (error) {
    throw new Error('몬스터 Death 처리 중 에러 발생', error);
  }
};
