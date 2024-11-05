import pools from '../../DB/dataBase.js';

export const getTower = async (towerId, user) => {
  // 유저 전체 정보 가져옴
  const user = await pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

  const userTowers = user.towerData;

  return userTowers.find((userTower) => {
    userTower.towerId === towerId;
  });
};

export const towerAttackVerifiy = async (towerId, monsterId) => {
  // 유저 전체 정보 가져옴
  const user = await pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

  const userMonsters = user.monsterData;

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
