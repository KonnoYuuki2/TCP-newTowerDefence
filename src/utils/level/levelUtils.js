import { UserFields } from '../../constants/constant.js';
import { redis } from '../redis/redis.js';

// 현재 레벨 가져오기
export const getMonsterLevel = async (socket) => {
  const level = await redis.getUserField(socket.id, UserFields.MONSTER_LEVEL);

  return level;
};

// 레벨 설정 하기
export const setMonsterLevel = async (socket, level) => {
  await redis.updateUserField(socket.id, UserFields.MONSTER_LEVEL, level + 1);
};
