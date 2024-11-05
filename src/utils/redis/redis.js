import pools from '../../DB/dataBase.js';

const redisClient = pools.GAME_DATABASE_REDIS;

// Prefix 상수
const USER_PREFIX = 'user';
const USERS_PREFIX = 'users';
const GAME_SESSION_PREFIX = 'gameSession';

export const redis = {
  // 게임 세션에 유저 추가
  addUser: async (gameId, user) => {
    const userKey = `${GAME_SESSION_PREFIX}:${gameId}:${USER_PREFIX}:${user.id}`;
    await redisClient.hset(userKey, {
      socketId: user.socket.id,
      userId: user.id,
    });
    await redisClient.sadd(`${GAME_SESSION_PREFIX}:${gameId}:${USERS_PREFIX}`, user.id);
  },

  // 게임 세션에서 유저 제거
  removeUser: async (gameId, socket) => {
    const userId = await redisClient.hget(
      `${GAME_SESSION_PREFIX}:${gameId}:socketToUser`,
      socket.id,
    );
    if (userId) {
      const userKey = `${GAME_SESSION_PREFIX}:${gameId}:${USER_PREFIX}:${userId}`;
      const userData = await redisClient.hgetall(userKey);
      await redisClient.del(userKey);
      await redisClient.srem(`${GAME_SESSION_PREFIX}:${gameId}:${USERS_PREFIX}`, userId);
      return userData;
    }
    return null;
  },

  // 게임 세션에서 유저 조회
  getUser: async (gameId, userId) => {
    const userKey = `${GAME_SESSION_PREFIX}:${gameId}:${USER_PREFIX}:${userId}`;
    return await redisClient.hgetall(userKey);
  },

  // 게임 세션의 유저 수 조회
  getGameUserCount: async (gameId) => {
    return await redisClient.scard(`${GAME_SESSION_PREFIX}:${gameId}:${USERS_PREFIX}`);
  },

  // 유저 게임 데이터 관리
  setUserData: async (userId, userData) => {
    try {
      await redisClient.hset(`${USER_PREFIX}:${userId}`, {
        userGold: userData.userGold,
        baseHp: userData.baseHp,
        towerData: JSON.stringify(userData.towerData),
        monsterData: JSON.stringify(userData.monsterData),
        level: userData.level,
        score: userData.score,
      });
    } catch (error) {
      console.error(`유저 데이터 저장 중 에러 발생: ${error}`);
    }
  },

  getUserData: async (userId) => {
    try {
      const data = await redisClient.hgetall(`${USER_PREFIX}:${userId}`);
      if (!data) return null;

      return {
        userGold: parseInt(data.userGold),
        baseHp: parseInt(data.baseHp),
        towerData: JSON.parse(data.towerData),
        monsterData: JSON.parse(data.monsterData),
        level: parseInt(data.level),
        score: parseInt(data.score),
      };
    } catch (error) {
      console.error(`유저 데이터 조회 중 에러 발생: ${error}`);
    }
  },

  updateUserField: async (userId, field, value) => {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await redisClient.hset(`${USER_PREFIX}:${userId}`, field, stringValue);
    } catch (error) {
      console.error(`유저 필드 업데이트 중 에러 발생: ${error}`);
    }
  },

  deleteUserData: async (userId) => {
    try {
      await redisClient.del(`${USER_PREFIX}:${userId}`);
    } catch (error) {
      console.error(`유저 데이터 삭제 중 에러 발생: ${error}`);
    }
  },
};
