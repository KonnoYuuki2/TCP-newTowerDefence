import pools from '../../DB/dataBase.js';

export const getBaseHp = async (user) => {
  const user = await pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

  return user.baseHp;
};

export const monsterAttackBaseHpVerify = async (damage, user) => {
  const baseHp = await getBaseHp(user);

  if (!baseHp) {
    throw new Error(`baseHp가 존재하지 않습니다.`);
  }

  baseHp -= damage;

  // 유저 정보 업데이트 해주기
  await pools.GAME_DATABASE_REDIS.hset(user.uuid, 'baseHp', baseHp);
};
