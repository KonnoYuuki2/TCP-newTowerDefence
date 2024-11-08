import pools from '../../DB/dataBase.js';

const redisClient = pools.GAME_DATABASE_REDIS;

// Prefix 상수
const USER_PREFIX = 'user';
const GAME_SESSION_PREFIX = 'gameSession';
const MATCH_PREFIX = 'matchQueue';

export const redis = {
  // 게임 세션에 유저 추가
  addUser: async (gameId, userId) => {
    const key = `${GAME_SESSION_PREFIX}:${gameId}`;
    await redisClient.sadd(key, userId);
    await redisClient.expire(key, 3600);
  },

  // 게임 세션에서 유저 제거
  removeUser: async (gameId, userId) => {
    await redisClient.srem(`${GAME_SESSION_PREFIX}:${gameId}`, userId);
  },

  // 게임 세션의 모든 유저 조회
  getUsers: async (gameId) => {
    const users = await redisClient.smembers(`${GAME_SESSION_PREFIX}:${gameId}`);
    return users;
  },

  // 게임 세션에서 유저 조회
  getUser: async (gameId, userId) => {
    const exists = await redisClient.sismember(`${GAME_SESSION_PREFIX}:${gameId}`, userId);
    return exists === 1 ? userId : null;
  },

  // 유저 게임 데이터 설정
  setUserData: async (userId, userData) => {
    const key = `${USER_PREFIX}:${userId}`;
    try {
      await redisClient.hset(key, {
        userGold: userData.userGold,
        baseHp: userData.baseHp,
        towerData: JSON.stringify(userData.towerData),
        monsterData: JSON.stringify(userData.monsterData),
        level: userData.level,
        score: userData.score,
      });
      await redisClient.expire(key, 3600);
    } catch (error) {
      console.error(`유저 데이터 저장 중 에러 발생: ${error}`);
    }
  },

  // 유저 게임 데이터 조회
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

  getUserData2: async (userId) => {
    try {
      const data = await redisClient.hgetall(`${USER_PREFIX}:${userId}`);
      if (!data) return null;

      return {
        userGold: parseInt(data.userGold),
        baseHp: parseInt(data.baseHp),
        level: parseInt(data.level),
        score: parseInt(data.score),
      };
    } catch (error) {
      console.error(`유저 데이터 조회 중 에러 발생: ${error}`);
    }
  },

  getUserField: async (userId, field) => {
    try {
      const data = await redisClient.hget(`${USER_PREFIX}:${userId}`, field);
      if (!data) return null;

      // 필드에 따라 형 변환
      if (['userGold', 'baseHp', 'level', 'score'].includes(field)) {
        return parseInt(data);
      } else if (['towerData', 'monsterData'].includes(field)) {
        return JSON.parse(data);
      }

      return data;
    } catch (error) {
      console.error(`유저 필드 조회 중 에러 발생: ${error}`);
    }
  },

  // 유저 게임 데이터 수정
  updateUserField: async (userId, field, value) => {
    const key = `${USER_PREFIX}:${userId}`;
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await redisClient.hset(key, field, stringValue);
      await redisClient.expire(key, 3600);
    } catch (error) {
      console.error(`유저 필드 업데이트 중 에러 발생: ${error}`);
    }
  },

  // 유저 게임 데이터 삭제
  deleteUserData: async (userId) => {
    try {
      await redisClient.del(`${USER_PREFIX}:${userId}`);
    } catch (error) {
      console.error(`유저 데이터 삭제 중 에러 발생: ${error}`);
    }
  },

  // 매칭 대기열 관련 메서드
  addToMatchQueue: async (player) => {
    await redisClient.rpush(MATCH_PREFIX, JSON.stringify(player));
  },

  getMatchQueue: async () => {
    const queue = await redisClient.lrange(MATCH_PREFIX, 0, -1);
    return queue.map((player) => JSON.parse(player));
  },

  removeFromMatchQueue: async (count) => {
    return await redisClient.lpop(MATCH_PREFIX, count);
  },
};
