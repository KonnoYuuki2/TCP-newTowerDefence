import pools from '../../DB/dataBase.js';

export const spawnMonster = async (user) => {
  const user = pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

  const monsterId = 'value++'
  const monsterNumber = 'value++'

  const spawn = { monsterId : monsterId, monsterNumber : monsterNumber }
  //   const monster = pools.GAME_DATABASE_REDIS.set(user.uuid)
  await pools.GAME_DATABASE_REDIS.set(user.uuid, 'monsterData', JSON.stringify(spawn));
  // redis 안에 몬스터데이터에 새로운 id랑 number를 만들어서 대입
};

export const getMonsterList = async (user) => {
  const user = pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

  return user.monster;
};
// 이게 몬스터 전체가 나오나?
// { 'monsterId' : 1 , 'monsterNumber' : 1 }, { ' monsterId : 2, 'monsterNumber' : 2 }

export const monsterDeath = async (user, monsterId) => {
  // 해당 몬스터 아이디를 지정해서 해당 몬스터를 서버에서 삭제  
  const monsterList = getMonsterList(user)

  const monster = monsterList.monsterId


};
// { monsterid:1, monsternumber:1},
