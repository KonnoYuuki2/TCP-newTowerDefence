import { UserFields } from '../../constants/enum.js';
import pools from '../../DB/dataBase.js';
import { redis } from '../redis/redis.js';

export const getBaseHp = async (user) => {
  const baseHp = await redis.getUserField(user.uuid, UserFields.BASE_HP);
  await pools.GAME_DATABASE_REDIS.hget(`user:${user.uuid}`, 'baseHp');

  return baseHp;
};

export const monsterAttackBaseHpVerify = async (damage, user) => {
  const baseHp = await getBaseHp(user);

  if (!baseHp) {
    throw new Error(`baseHp가 존재하지 않습니다.`);
  }

  baseHp -= damage;

  // 유저 정보 업데이트 해주기
  await redis.updateUserField(user.uuid, UserFields.BASE_HP, baseHp);
};
