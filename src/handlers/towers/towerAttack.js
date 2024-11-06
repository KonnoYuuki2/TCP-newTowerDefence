import { redis } from '../../utils/redis/redis.js';
import { createS2CEnemyTowerAttackNotification } from '../../utils/towers/notification/towerNotification.js';
import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

export const towerAttackHandler = async (socket, payload) => {
  try {
    const { towerId, monsterId } = payload;

    // 타워, 몬스터 유무 검증
    await towerAttackVerifiy(towerId, monsterId);

    // 적 유저 정보 가져옴
    // 여기서 레디스 정보를 가져온다면 밑에 부분 삭제 고려
    const enemeyUser = await getEnemyUserBySocketId(socket.id);

    // 적 유저 검증
    const EnemyUserSocket = await redis.getUser(gameId, enemeyUser.userId).socket;

    EnemyUserSocket.write(createS2CEnemyTowerAttackNotification(towerId, monsterId));
  } catch (error) {
    throw new Error(`타워 공격 정보 처리중 에러 발생`, error);
  }
};
