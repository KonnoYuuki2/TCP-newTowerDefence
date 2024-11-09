import { UserFields } from '../../../constants/constant.js';
import { redis } from '../../redis/redis.js';

export const getUserGold = async (socket) => {
  const userGold = await redis.getUserField(socket.id, UserFields.USER_GOLD);

  return userGold;
};

export const setUserGold = async (socket, gold) => {
  await redis.updateUserField(socket.id, UserFields.USER_GOLD, gold);
};

export const calculateUserGold = async (gold, level) => {
  return level * 100 + gold;
};
