import { PacketType } from '../../constants/header.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { oppoSocketWrite } from '../../utils/socket/socketUtils.js';
import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

/**
 * 타워 공격 요청시 처리 함수
 * @param {socket, Object}  // socket, payload
 */
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
    await handleError(socket, error);
  }
};
