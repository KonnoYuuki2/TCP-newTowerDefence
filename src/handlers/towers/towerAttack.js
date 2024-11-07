import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

export const towerAttackHandler = async ({ socket, payload }) => {
  try {
    const fieldName = Object.keys(payload)[0];

    const { towerId, monsterId } = payload[fieldName];

    // 타워, 몬스터 유무 검증
    await towerAttackVerifiy(towerId, monsterId, socket.id);

    // 적 유저 정보 가져옴

    let enemySocket;

    for (const key of connectedSockets.keys()) {
      if (key !== socket.id) {
        enemySocket = connectedSockets.get(key);
        break; // 첫 번째 다른 소켓을 찾았으므로 반복을 중단
      }
    }

    const towerAttackPacket = { enemyTowerAttackNotification: { towerId: 1, monsterId: 1 } };

    enemySocket.write(
      createResponse(PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION, 0, towerAttackPacket),
    );
  } catch (error) {
    throw new Error(`타워 공격 정보 처리중 에러 발생`, error);
  }
};
