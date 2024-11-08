import { UserFields } from '../../constants/constant.js';
import { redis } from '../redis/redis.js';

// 몬스터데이터 리스트에 새로운 몬스터아이디를 가진 객체를 생성해서 배열에 추가
export const spawnMonster = async (socket) => {
  try {
    let monsterData = await redis.getUserField(socket.id, UserFields.MONSTERS);
    const monsterLevel = await redis.getUserField(socket.id, UserFields.MONSTER_LEVEL);
    if (monsterData == null) {
      monsterData = [];
    }

    // 세션에 접속 중인 유저들 조회
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

    const spawnMonster = { monsterId, monsterNumber, monsterLevel };

    monsterData.push(spawnMonster);

    await redis.updateUserField(socket.id, UserFields.MONSTERS, monsterData);

    return spawnMonster;
  } catch (error) {
    console.error(`몬스터 스폰 함수 실행 중 에러 발생: ${error}`);
  }
};

// 몬스터데이터 리스트에서 죽은 몬스터의Id를 찾아서 해당 아이디를 가진 몬스터를 제거
export const monsterDeath = async (socket, monsterId) => {
  try {
    const monsterData = await redis.getUserField(socket.id, UserFields.MONSTERS);

    for (let i = 0; i < monsterData.length; i++) {
      if (monsterData[i].monsterId === monsterId) {
        monsterData.splice(i, 1);
        break;
      }
    }

    await redis.updateUserField(socket.id, UserFields.MONSTERS, monsterData);
  } catch (error) {
    console.error(`처치된 몬스터 삭제 중 에러 발생: ${error}`);
  }
};
