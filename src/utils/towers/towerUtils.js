import { UserFields } from '../../constants/enum.js';
import pools from '../../DB/dataBase.js';
import { redis } from '../redis/redis.js';

export const getTower = async (towerId, user) => {
  // 유저 전체 정보 가져옴
  const userTowers = await redis.getUserField(user.uuid, UserFields.TOWERS);

  return userTowers.find((userTower) => {
    userTower.towerId === towerId;
  });
};

export const towerAttackVerifiy = async (towerId, monsterId, user) => {
  // 유저 전체 정보 가져옴
  const userMonsters = await redis.getUserField(user.uuid, UserFields.MONSTERS);

  const monster = await userMonsters.find((userMonster) => {
    userMonster.monsterId === monsterId;
  });

  if (!monster) {
    throw new Error(`몬스터의 정보가 존재하지 않습니다.`);
  }

  const tower = await getTower(towerId, user);

  if (!tower) {
    throw new Error(`타워 정보가 존재하지 않습니다.`);
  }
};
