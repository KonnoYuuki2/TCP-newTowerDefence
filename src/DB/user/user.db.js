import pools from '../dataBase.js';
import { SQL_QUERIES } from './user.queries.js';
export const findUser = async (account_id) => {
  const reselt = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT_ID, [
    account_id,
  ]);

  return reselt[0];
};

export const createUser = async (account_id, uuid, password, email) => {
  const isUserRegistered = await findUser(account_id);
  if (isUserRegistered == null) return Error('유저가 이미 존재함');

  await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_USER, [account_id, uuid, password, email]);
  return { account_id, uuid, password, email };
};

// export const updateUserLogin = async (id) => {
//   await pools.USER_DATABASE_SQL.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
// };
