import { createUser } from '../DB/user/user.db.js';

export const registerHander = async (payload) => {
  //console.dir(payload, { depth: null });
  const fieldName = Object.keys(payload)[0];
  if (fieldName === 'registerRequest') {
    const { id, password, email } = payload[fieldName];
    await createUser(id, password, email);
    // 대충 데이터베이스 에러
    // 대충 리스폰 생성
  } else {
  }
};
