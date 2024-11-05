import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

export const towerAttackHandler = (socket, payload) => {
  try {
    // 1.현재 유저 정보 불러오기
    // 임시적임 함수 명임
    const user = getAccountBySocket(socket);

    const { towerId, monsterId } = payload;

    // 타워, 몬스터 유무 검증
    towerAttackVerifiy(towerId, monsterId, user);

    // 적 유저 정보 가져옴
    const EnemeyUser = getEnemyAccountBySocket(socket);

    // S2CEnemyTowerAttackNotification - Utils에 기능 개발 필요
    EnemeyUser.socket.write(S2CEnemyTowerAttackNotification(towerId, monsterId));
  } catch (error) {
    throw new Error(`타워 공격 정보 처리중 에러 발생`, error);
  }
};
