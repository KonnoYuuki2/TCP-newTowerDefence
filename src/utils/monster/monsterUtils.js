import { UserFields } from '../../constants/enum.js';
import { redis } from '../redis/redis.js';

// 몬스터데이터 리스트에 새로운 몬스터아이디를 가진 객체를 생성해서 배열에 추가
export const spawnMonster = async (socket) => {
  let monsterData = await redis.getUserField(socket.id, UserFields.MONSTERS);
  if (monsterData == null) {
    monsterData = [];
  }

  const users = await redis.getUsers(socket.gameId);
  let monsterId = 0;

  let lastId;
  if (monsterData.length > 0) {
    lastId = Math.max(...monsterData.map((el) => el.monsterId));
  } else {
    lastId = users[0] === socket.id ? 0 : 100000;
  }

  monsterId = ++lastId;

  let monsterNumber = Math.floor(Math.random() * 4) + 1;
  // if (monsterData.length > 0) {
  //   monsterId = monsterData[monsterData.length - 1].monsterId + 1;
  // } else {
  //   monsterId = 1;
  // }

  const spawnMonster = { monsterId: monsterId, monsterNumber: monsterNumber };

  monsterData.push(spawnMonster);

  await redis.updateUserField(socket.id, UserFields.MONSTERS, monsterData);

  return spawnMonster;
};

// 몬스터데이터 리스트에서 죽은 몬스터의Id를 찾아서 해당 아이디를 가진 몬스터를 제거
export const monsterDeath = async (socket, monsterId) => {
  const monsterData = await redis.getUserField(socket.id, UserFields.MONSTERS);

  for (let i = 0; i < monsterData.length; i++) {
    if (monsterData[i].monsterId === monsterId) {
      console.log(`지우기 전`, monsterData);
      monsterData.splice(i, 1);
      console.log(`지워진 몬스터 데이터`, monsterData);
      break;
    }
  }

  await redis.updateUserField(socket.id, UserFields.MONSTERS, monsterData);
};
