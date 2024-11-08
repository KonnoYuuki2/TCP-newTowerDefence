import pools from '../../DB/dataBase.js';

const redisClient = pools.GAME_DATABASE_REDIS;

// Prefix 상수
const USER_PREFIX = 'user';
const GAME_SESSION_PREFIX = 'gameSession';
const MATCH_PREFIX = 'matchQueue';

export const redis = {
  /**
   * 게임 세션에 유저 추가
   * @param {String} gameId
   * @param {String} userId
   */
  addUser: async (gameId, userId) => {
    try {
      const key = `${GAME_SESSION_PREFIX}:${gameId}`;
      await redisClient.sadd(key, userId);
      await redisClient.expire(key, 3600);
    } catch (error) {
      console.error(`게임 세션에 유저 추가 중 에러 발생: ${error}`);
    }
  },

  /**
   * 게임 세션에서 유저 제거
   * @param {String} gameId
   * @param {String} userId
   */
  removeUser: async (gameId, userId) => {
    try {
      await redisClient.srem(`${GAME_SESSION_PREFIX}:${gameId}`, userId);
    } catch (error) {
      console.error(`게임 세션에 유저 삭제 중 에러 발생: ${error}`);
    }
  },

  /**
   * 게임 세션의 모든 유저 조회
   * @param {String} gameId
   * @returns
   */
  getUsers: async (gameId) => {
    try {
      const users = await redisClient.smembers(`${GAME_SESSION_PREFIX}:${gameId}`);
      return users;
    } catch (error) {
      console.error(`게임 세션의 모든 유저 조회 중 에러 발생: ${error}`);
    }
  },

  /**
   * 게임 세션에서 유저 조회
   * @param {String} gameId
   * @param {String} userId
   * @returns {String} 유저의 userId(uuid)
   */
  getUser: async (gameId, userId) => {
    try {
      const exists = await redisClient.sismember(`${GAME_SESSION_PREFIX}:${gameId}`, userId);
      return exists === 1 ? userId : null;
    } catch (error) {
      console.error(`게임 세션에서 유저 조회 중 에러 발생: ${error}`);
    }
  },

  /**
   * 게임 세션 삭제
   * @param {String} gameId
   */
  deleteSession: async (gameId) => {
    try {
      await redisClient.del(`${GAME_SESSION_PREFIX}:${gameId}`);
    } catch (error) {
      console.error(`게임 세션 삭제 중 에러 발생: ${error}`);
    }
  },

  /**
   * 유저 게임 데이터 설정
   * @param {String} userId
   * @param {Object} userData
   */
  setUserData: async (userId, userData) => {
    const key = `${USER_PREFIX}:${userId}`;
    try {
      await redisClient.hset(key, {
        userGold: userData.userGold,
        baseHp: userData.baseHp,
        towers: JSON.stringify(userData.towers),
        monsters: JSON.stringify(userData.monsters),
        monsterLevel: userData.monsterLevel,
        score: userData.score,
      });
      await redisClient.expire(key, 3600);
    } catch (error) {
      console.error(`유저 데이터 저장 중 에러 발생: ${error}`);
    }
  },

  /**
   * 유저 게임 데이터 조회
   * @param {String} userId
   * @returns {Object} 유저의 데이터
   */
  getUserData: async (userId) => {
    try {
      const data = await redisClient.hgetall(`${USER_PREFIX}:${userId}`);
      if (!data) return null;

      return {
        userGold: parseInt(data.userGold),
        baseHp: parseInt(data.baseHp),
        towers: JSON.parse(data.towers),
        monsters: JSON.parse(data.monsters),
        monsterLevel: parseInt(data.monsterLevel),
        score: parseInt(data.score),
      };
    } catch (error) {
      console.error(`유저 데이터 조회 중 에러 발생: ${error}`);
    }
  },

  /**
   * 유저의 특정 필드 데이터 조회
   * @param {String} userId
   * @param {String} field
   * @returns {Number || Object}
   */
  getUserField: async (userId, field) => {
    try {
      const data = await redisClient.hget(`${USER_PREFIX}:${userId}`, field);
      if (!data) return null;

      // 필드에 따라 형 변환
      if (['userGold', 'baseHp', 'monsterLevel', 'score'].includes(field)) {
        return parseInt(data);
      } else if (['towers', 'monsters'].includes(field)) {
        return JSON.parse(data);
      }

      return data;
    } catch (error) {
      console.error(`유저 필드 조회 중 에러 발생: ${error}`);
    }
  },

  /**
   * 유저의 특정 필드 데이터 수정
   * @param {String} userId
   * @param {String} field
   * @param {Number || Array} value
   */
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

  /**
   * 유저 게임 데이터 삭제
   * @param { String } userId
   */
  deleteUserData: async (userId) => {
    try {
      await redisClient.del(`${USER_PREFIX}:${userId}`);
    } catch (error) {
      console.error(`유저 데이터 삭제 중 에러 발생: ${error}`);
    }
  },

  // 매칭 대기열 관련 메서드
  /**
   * 매치 큐에 유저 추가
   * @param { Object } player
   */
  addToMatchQueue: async (player) => {
    try {
      await redisClient.rpush(MATCH_PREFIX, JSON.stringify(player));
    } catch (error) {
      console.error(`매치 큐에 유저 추가 중 에러 발생: ${error}`);
    }
  },

  /**
   * 매치 큐의 유저 조회
   * @returns { Array } 큐에 있는 유저들
   */
  getMatchQueue: async () => {
    try {
      const queue = await redisClient.lrange(MATCH_PREFIX, 0, -1);
      return queue.map((player) => JSON.parse(player));
    } catch (error) {
      console.error(`매치 큐의 유저 조회 중 에러 발생: ${error}`);
    }
  },

  /**
   * 매치 큐에서 유저 삭제
   * @param {Number} count // 삭제할 유저 수
   */
  removeFromMatchQueue: async (count) => {
    try {
      await redisClient.lpop(MATCH_PREFIX, count);
    } catch (error) {
      console.error(`매치 큐의 유저 삭제 중 에러 발생: ${error}`);
    }
  },
};

export const deleteData = async (socket) => {
  // 게임 세션 삭제
  await redis.deleteSession(socket.gameId);
  // 유저 데이터 삭제
  await redis.deleteUserData(socket.id);
};
