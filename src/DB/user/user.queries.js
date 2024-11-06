export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE account_id = ?',
  CREATE_USER: 'INSERT INTO accounts (account_id, password, email) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
};
