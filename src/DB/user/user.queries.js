export const SQL_QUERIES = {
  FIND_USER_BY_ACCOUNT_ID: 'SELECT * FROM accounts WHERE account_id = ?',
  //FIND_USER_BY_ACCOUNT_ID_PASSWORD: 'SELECT * FROM user WHERE'
  CREATE_USER: 'INSERT INTO accounts (account_id, password, email) VALUES (?, ?, ?)',
  //UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
};
