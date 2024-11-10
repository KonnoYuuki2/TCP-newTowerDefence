import { UserFields } from '../../constants/constant.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { redis } from '../redis/redis.js';

export const getBaseHp = async (userId) => {
  const baseHp = await redis.getUserField(userId, UserFields.BASE_HP);

  return baseHp;
};

export const baseHpVerify = async (damage, userId) => {
  try {
    let baseHp = await getBaseHp(userId);

    baseHp -= damage;

    // 유저 정보 업데이트 해주기
    await redis.updateUserField(userId, UserFields.BASE_HP, baseHp);

    return baseHp;
  } catch (error) {
    throw new CustomError(ErrorCodes.GAME_STATE_UPDATE_ERROR, `기지 체력 업데이트 중 에러 발생`);
  }
};
