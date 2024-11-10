import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import pools from '../dataBase.js';
import { SQL_QUERIES } from './user.queries.js';
export const findUser = async (account_id) => {
  try {
    const reselt = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT_ID, [
      account_id,
    ]);

    return reselt[0];
  } catch (error) {
    throw new CustomError(
      ErrorCodes.DATABASE_QUERY_ERROR,
      `account_id로 유저 정보 조회 중 에러 발생`,
    );
  }
};

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
