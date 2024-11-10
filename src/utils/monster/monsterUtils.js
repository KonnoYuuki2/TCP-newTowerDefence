import { UserFields } from '../../constants/constant.js';
import { getGameAssets } from '../../init/assets.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { calculateUserGold, getUserGold, setUserGold } from '../gameState/gold/goldUtils.js';
import { getMonsterLevel, setMonsterLevel } from '../gameState/level/levelUtils.js';
import { calculateScore, getScore, setScore } from '../gameState/score/scoreUtils.js';
import { redis } from '../redis/redis.js';

/**
 * 몬스터를 생성하여 저장하는 함수
 * @param {*} socket
 * @returns {Object}
 */
export const spawnMonster = async (socket) => {
  try {
    let monsterData = await redis.getUserField(socket.id, UserFields.MONSTERS);
    const monsterLevel = await getMonsterLevel(socket);
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
    throw new CustomError(ErrorCodes.MONSTER_SPAWN_ERROR, `몬스터 생성 중 에러 발생`);
  }
};

/**
 * 사망한 몬스터 id를 지우는 함수
 * @param {*} socket
 * @param {*} monsterId
 */
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
    throw new CustomError(ErrorCodes.MONSTER_NOT_FOUND, `처치된 몬스터 삭제 중 에러 발생`);
  }
};

export const monsterDeathUpdateGameState = async (socket) => {
  try {
    const { data } = getGameAssets().monsterLevel;

    // 몬스터가 죽었을 떄 레벨에 따라서 스코어 증가 및 갱신
    const score = await getScore(socket);
    const monsterLevel = await getMonsterLevel(socket);

    await setScore(socket, await calculateScore(score, monsterLevel));

    const gold = await getUserGold(socket);

    await setUserGold(socket, await calculateUserGold(gold, monsterLevel));

    const increasedScore = await getScore(socket);

    const levelData = data.find((el) => el.id === monsterLevel);

    if (increasedScore >= levelData.nextLevel) {
      if (levelData.id < 15) await setMonsterLevel(socket, monsterLevel);
    }
  } catch (error) {
    throw new CustomError(ErrorCodes.GAME_STATE_UPDATE_ERROR, `유저 데이터 업데이트 중 에러 발생`);
  }
};
