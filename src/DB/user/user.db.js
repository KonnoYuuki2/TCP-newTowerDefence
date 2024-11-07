import pools from '../dataBase.js';
import { SQL_QUERIES } from './user.queries.js';
import CustomError from '../../utils/error/customError.js';
export const findUser = async (account_id) => {
  const reselt = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT_ID, [
    account_id,
  ]);

  return reselt[0];
};

export const createUser = async (account_id, password, email) => {
  const uuid = uuidv4();

  const saltRounds = 10;
  const newPassword = await bcrypt.hash(password, saltRounds);

  const isUserRegistered = await findUser(account_id);
  if (isUserRegistered == null) return Error('유저가 이미 존재함');

  await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_USER, [
    account_id,
    uuid,
    newPassword,
    email,
  ]);
  return { account_id, uuid, newPassword, email };
};

// export const updateUserLogin = async (id) => {
//   await pools.USER_DATABASE_SQL.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
// };
