import { PacketType } from '../../constants/header.js';
import { oppoSocketWrite } from '../../utils/socket/socketUtils.js';
import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

export const towerAttackHandler = async ({ socket, payload }) => {
  try {
    const { towerId, monsterId } = payload;

    // 타워, 몬스터 유무 검증
    await towerAttackVerifiy(towerId, monsterId, socket.id);

    const towerAttackPacket = {
      enemyTowerAttackNotification: { towerId: towerId, monsterId: monsterId },
    };

    await oppoSocketWrite(socket, PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION, towerAttackPacket);
  } catch (error) {
    console.error(`타워 공격 정보 처리중 에러 발생: ${error}`);
  }
};
