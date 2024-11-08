import { UserFields } from '../../constants/constant.js';
import { redis } from '../redis/redis.js';

export const getBaseHp = async (userId) => {
  const baseHp = await redis.getUserField(userId, UserFields.BASE_HP);

  return baseHp;
};

export const baseHpVerify = async (damage, userId) => {
  let baseHp = await getBaseHp(userId);

  if (!baseHp) {
    console.log(`baseHp가 존재하지 않습니다.`);
    // throw new Error(`baseHp가 존재하지 않습니다.`);
  }

  baseHp -= damage;

  // 유저 정보 업데이트 해주기
  await redis.updateUserField(userId, UserFields.BASE_HP, baseHp);

  return baseHp;
};
