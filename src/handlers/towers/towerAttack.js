import { connectedSockets } from '../../events/onConnection.js';
import { redis } from '../../utils/redis/redis.js';
import { createS2CEnemyTowerAttackNotification } from '../../utils/towers/notification/towerNotification.js';
import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

export const towerAttackHandler = async ({ socket, payload }) => {
  try {
    const fieldName = Object.keys(payload)[0];

    const { towerId, monsterId } = payload[fieldName];

    // 타워, 몬스터 유무 검증
    await towerAttackVerifiy(towerId, monsterId, socket.id);

    // 적 유저 정보 가져옴
    const enemySocket = connectedSockets.forEach((value, key) => {
      return key !== socket.id;
    });

    //console.log(`너 없지?`, enemySocket); // 테스트 코드 상에선 없다.
    const towerAttackPacket = { enemyTowerAttackNotification: { towerId: 1, monsterId: 1 } };

    enemySocket.write(createS2CEnemyTowerAttackNotification(towerAttackPacket));
  } catch (error) {
    throw new Error(`타워 공격 정보 처리중 에러 발생`, error);
  }
};
