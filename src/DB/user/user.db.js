import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import pools from '../dataBase.js';
import { SQL_QUERIES } from './user.queries.js';

/**
 * account_Id로 유저 찾기
 * @param {account_id} account_id
 * @returns {Object}
 */
export const findUser = async (account_id) => {
  try {
    const result = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT_ID, [
      account_id,
    ]);

    return result[0];
  } catch (error) {
    throw new CustomError(
      ErrorCodes.DATABASE_QUERY_ERROR,
      `account_id로 유저 정보 조회 중 에러 발생`,
    );
  }
};

/**
 * 유저 생성하기
 * @param {account_id} account_id
 * @param {uuid} uuid
 * @param {password} password
 * @param {email} email
 * @returns {account_id, uuid, password, email}
 */
export const createUser = async (account_id, uuid, password, email) => {
  try {
    const isUserRegistered = await findUser(account_id);
    if (isUserRegistered == null) {
      console.error(`유저가 이미 존재합니다.`);
      return;
    }

    await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_USER, [
      account_id,
      uuid,
      password,
      email,
    ]);

    return { account_id, uuid, password, email };
  } catch (error) {
    throw new CustomError(ErrorCodes.DATABASE_QUERY_ERROR, `account 생성 중 에러 발생`);
  }
};

/**
 *  Socket.id로 유저 찾기
 * @param {socketId} socket.id
 * @returns {string}
 */
export const findUserIdByUUID = async (socketId) => {
  const user = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_UUID, [socketId]);

  return user[0][0].id;
};

/**
 * id로 highScore 찾기
 * @param {*} userId
 * @returns {number}
 */
export const findHighScoreByUserId = async (userId) => {
  const highScore = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_HIGHSCORE_BY_ID, [userId]);

  return highScore[0][0] ? highScore[0][0].score : 0;
};
