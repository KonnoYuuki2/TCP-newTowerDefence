import { UserFields } from '../../constants/enum.js';
import pools from '../../DB/dataBase.js';
import { redis } from '../redis/redis.js';

export const getBaseHp = async (user) => {
  const baseHp = await redis.getUserField(user.uuid, UserFields.BASE_HP);

  return baseHp;
};

export const monsterAttackBaseHpVerify = async (damage) => {
  const user = connectedSockets.forEach((value, key) => {
    return key === socket.id;
  });

  if (!user) {
    throw new Error(`유저가 존재하지 않습니다.`);
  }
  const baseHp = await getBaseHp(user);

  if (!baseHp) {
    throw new Error(`baseHp가 존재하지 않습니다.`);
  }

  baseHp -= damage;

  // 유저 정보 업데이트 해주기
  await redis.updateUserField(user.uuid, UserFields.BASE_HP, baseHp);

  console.log(`베이스 피격 정보 업데이트에 성공했습니다.`);
};
