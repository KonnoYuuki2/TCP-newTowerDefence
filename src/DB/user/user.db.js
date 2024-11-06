//import { v4 as uuidv4 } from 'uuid';
import pools from '../dataBase.js';
import { SQL_QUERIES } from './user.queries.js';

export const findUser = async (account_id) => {
  const reselt = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT_ID, [
    account_id,
  ]);
  console.log(reselt);
  return reselt[0];
};

export const createUser = async (account_id, password, email) => {
  //const id = uuidv4();
  // 아이디 uuid
  // 패스워드 암호화 필요
  // 중복 처리 필요
  await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_USER, [account_id, password, email]);

  return { account_id, password, email };
};

// export const updateUserLogin = async (id) => {
//   await pools.USER_DATABASE_SQL.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
// };
