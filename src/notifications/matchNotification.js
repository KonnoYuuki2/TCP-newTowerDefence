import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import pools from '../DB/dataBase.js';
import { findHighScoreByUserId, findUserIdByUUID } from '../DB/user/user.db.js';
import { SQL_QUERIES } from '../DB/user/user.queries.js';
import {
  createInitialGameState,
  createInitialPlayerData,
  createInitialTowers,
} from '../utils/gameState/initialState/init.js';
import { redis } from '../utils/redis/redis.js';

/**
 * 유저 데이터를 생성하는 함수
 * @param {string} hostSocketId // player1
 * @param {string} oppoSocketId // player2
 * @returns { packet1, packet2 } 각 유저의 유저 데이터
 */
export const createUserData = async (hostSocketId, oppoSocketId) => {
  try {
    const initialGameState = createInitialGameState();

    const hostId = await findUserIdByUUID(hostSocketId);

    const oppoId = await findUserIdByUUID(oppoSocketId);

    //하이스코어 조회 추가 필요
    const hostHighScore = await findHighScoreByUserId(hostId);

    const oppoHighScore = await findHighScoreByUserId(oppoId);

    // 플레이어와 상대방 초기 데이터 설정
    const playerData = createInitialPlayerData(
      initialGameState,
      createInitialTowers(3),
      hostHighScore ? hostHighScore : 0,
    );
    const opponentData = createInitialPlayerData(
      initialGameState,
      createInitialTowers(3, 100000),
      oppoHighScore ? oppoHighScore : 0,
    );

    const packet1 = {
      matchStartNotification: {
        initialGameState: initialGameState,
        playerData: playerData,
        opponentData: opponentData,
      },
    };

    const packet2 = {
      matchStartNotification: {
        initialGameState: initialGameState,
        playerData: opponentData,
        opponentData: playerData,
      },
    };

    const userData1 = {
      userGold: playerData.userGold,
      baseHp: playerData.base.maxHp,
      towers: playerData.towers,
      monsters: playerData.monsters,
      monsterLevel: playerData.monsterLevel,
      score: playerData.score,
    };

    const userData2 = {
      userGold: opponentData.userGold,
      baseHp: opponentData.base.maxHp,
      towers: opponentData.towers,
      monsters: opponentData.monsters,
      monsterLevel: opponentData.monsterLevel,
      score: opponentData.score,
    };

    await redis.setUserData(hostSocketId, userData1);
    await redis.setUserData(oppoSocketId, userData2);

    return { packet1, packet2 };
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, `매칭 패킷 생성 중 에러 발생`);
  }
};
