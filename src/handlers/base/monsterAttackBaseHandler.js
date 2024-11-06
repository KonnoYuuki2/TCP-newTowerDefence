import { monsterAttackBaseHpVerify } from '../../utils/base/baseUtils.js';

export const monsterAttackBaseHandler = async (socket, payload) => {
  try {
    const { damage } = payload;

    // 유저가 레디스를 가져오는지 같은거 확인해야함
    const user = await getUserBySocketId(socket.id);

    await monsterAttackBaseHpVerify(damage, user);
  } catch (error) {
    throw new Error(`몬스터 베이스 어택 처리 중 에러 발생`, error);
  }
};
