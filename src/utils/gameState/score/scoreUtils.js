import { UserFields } from '../../../constants/constant.js';
import { getGameAssets } from '../../../init/assets.js';
import { redis } from '../../redis/redis.js';

// 스코어 관련 처리 유틸

// 스코어 가져오기
export const getScore = async (socket) => {
  const score = await redis.getUserField(socket.id, UserFields.SCORE);

  return score;
};

// 스코어 갱신
export const setScore = async (socket, score) => {
  await redis.updateUserField(socket.id, UserFields.SCORE, score);
};

// 하이스코어 가져오기
export const getHighScore = async (socket) => {
  const highScore = await redis.getUserField(socket.id, UserFields.HIGHSCORE);

  return highScore;
};

// 하이스코어 갱신
export const setHighScore = async (socket, highScore) => {
  const redisHighScore = await getHighScore(socket);

  await redis.updateUserField(socket.id, UserFields.HIGHSCORE, redisHighScore + highScore);
};

export const calculateScore = async (score, level) => {
  const { data } = getGameAssets().monsterLevel;
  const amount = data.find((el) => el.id === level);
  return score + amount.score;
};
