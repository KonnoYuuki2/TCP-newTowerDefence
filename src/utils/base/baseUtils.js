import { UserFields } from '../../constants/enum.js';
import pools from '../../DB/dataBase.js';
import { redis } from '../redis/redis.js';

export const getBaseHp = async (userId) => {
  const baseHp = await redis.getUserField(userId, UserFields.BASE_HP);

  return baseHp;
};

export const baseHpVerify = async (damage, userId) => {
  let baseHp = await getBaseHp(userId);

  if (!baseHp) {
    throw new Error(`baseHp가 존재하지 않습니다.`);
  }

  baseHp -= damage;

  // 유저 정보 업데이트 해주기
  await redis.updateUserField(userId, UserFields.BASE_HP, baseHp);

  console.log(await redis.getUserData(userId));

  console.log(`베이스 피격 정보 업데이트에 성공했습니다.`);

  return baseHp;
};
