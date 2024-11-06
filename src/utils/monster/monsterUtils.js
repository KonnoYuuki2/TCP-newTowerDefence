import pools from '../../DB/dataBase.js';

export const spawnMonster = async (user) => {
  const user = pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

  const monster =
};

export const getMonster = async (user) => {
  const user = pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

  return user.monster;
};

export const monsterDeath = async (user, monster) {
    const 
}
// {monsterid:1, monsternumber:1},
