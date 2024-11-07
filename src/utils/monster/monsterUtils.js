import { UserFields } from '../../constants/enum.js';
import { redis } from '../redis/redis.js';

// 몬스터데이터 리스트에 새로운 몬스터아이디를 가진 객체를 생성해서 배열에 추가
export const spawnMonster = async (socket) => {
  const monsterData = await redis.getUserField(socket.id, UserFields.MONSTERS);

  let monsterId = 1;
  let monsterNumber = Math.floor(Math.random() * 4) + 1;
  if (monsterData.length) {
    monsterId += monsterData[monsterData.length - 1].monsterId;
    monsterNumber += monsterData[monsterData.length - 1].monsterNumber;
  }
  // 잘못된 접근방식입니다. 지금 방식이 생각이 안나서
  // 몬스터가 존재할 때 가장 높은 Id와 Number를 가진 몬스터에서 +1을 하도록 했는데
  // 그냥 매 생성마다 +1을 하도록 짜야함

  const spawnMonster = { monsterId: monsterId, monsterNumber: monsterNumber };

  monsterData.push(spawnMonster);

  await redis.updateUserField(socket.id, UserFields.MONSTERS, monsterData);

  return spawnMonster;
};

// 몬스터데이터 리스트에서 죽은 몬스터의Id를 찾아서 해당 아이디를 가진 몬스터를 제거
export const monsterDeath = async (socket, monsterId) => {
  const monsterData = redis.getUserField(socket.id, UserFields.MONSTERS);

  for (let i = 0; i < monsterData.length; i++) {
    if (monsterData[i].monsterId === monsterId) {
      monsterData.splice(i, 1);
    }
  }

  await redis.updateUserField(socket.id, UserFields.MONSTERS, monsterData);
};
