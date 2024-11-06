import { redis } from '../redis/redis.js';

// 몬스터데이터 리스트에 새로운 몬스터아이디를 가진 객체를 생성해서 배열에 추가
export const spawnMonster = async (uuid) => {
  const userData = redis.getUserData(uuid);

  const monsterData = userData['monsterData'];

  let monsterId = 1;
  let monsterNumber = 101;
  const spawnMonster = { monsterId: monsterId, monsterNumber: monsterNumber };
  // 1은 임시값.
  // 리스트에서 가장 높은 monsterId를 찾아서 거기에 ++하는 방식도 무난하지만
  // 게임마다 초기화 되니까 그냥 전부 ++해서 넣는 방식도 괜찮다고 생각
  // 어떻게 할까? 1을 넣은 이후에 이 함수가 동작할 때 마다 값을 1씩 올리는 로직을 하나 만들면 ㅇㅋ지 않을까
  // 외부에 변수를 만들어서 하고싶지만 힘들겠지? 그럼 여기서 하는 방법을 생각해보자

  const updateMonsterData = monsterData.push(spawnMonster);

  await redis.updateUserField(uuid, MONSTERS, updateMonsterData);
};

// 몬스터데이터 리스트에서 죽은 몬스터의Id를 찾아서 해당 아이디를 가진 몬스터를 제거
export const monsterDeath = async (uuid, monsterId) => {
  const userData = redis.getUserData(uuid);

  const monsterData = userData['monsterData'];

  for (let i = 0; i < monsterData.length; i++) {
    if (monsterData[i].monsterId === monsterId) {
      monsterData.splice(i, 1);
    }
  }

  await redis.updateUserField(uuid, MONSTERS, monsterData);
};

// export const spawnMonster = async (user) => {
//   const user = pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

//   const monsterId = 'value++'
//   const monsterNumber = 'value++'

//   const spawn = { monsterId : monsterId, monsterNumber : monsterNumber }
//   //   const monster = pools.GAME_DATABASE_REDIS.set(user.uuid)
//   await pools.GAME_DATABASE_REDIS.hset(user.uuid, 'monsterData', JSON.stringify(spawn));
//   // redis 안에 몬스터데이터에 새로운 id랑 number를 만들어서 대입
// };

// export const getMonster = async (user, monsterId) => {
//   const user = pools.GAME_DATABASE_REDIS.hgetall(user.uuid);

//   for (i = 0; i < monsterId;i++) {
//     if (user.monsterData[i]['monsterId'] === monsterId)
//   }
//   const monster = user.monsterData
//   return user.monster;
// };
// 이게 몬스터 전체가 나오나?
// user.monsterData = [{ 'monsterId' : 1, 'monsterNumber' : 1}, {'monsterId': 2, 'monsterNumber':2}]
