import { connectedSockets } from '../../events/onConnection.js';
import { monsterAttackBaseHpVerify } from '../../utils/base/baseUtils.js';

export const monsterAttackBaseHandler = async ({ socket, payload }) => {
  try {
    const fieldName = Object.keys(payload)[0];

    const { damage } = payload[fieldName];

    await monsterAttackBaseHpVerify(damage, socket.id);
  } catch (error) {
    throw new Error(`몬스터 베이스 어택 처리 중 에러 발생`, error);
  }
};
