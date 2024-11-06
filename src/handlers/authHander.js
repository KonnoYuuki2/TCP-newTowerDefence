import { createUser, findUser } from '../DB/user/user.db.js';
import { createResponse } from '../utils/response/createResponse.js';
import { PacketType } from '../constants/header.js';
import bcrypt from 'bcrypt';
class AuthHandler {
  constructor() {
    Object.freeze(this);
  }
  createUser = async ({ socket, payload }) => {
    //console.dir(payload, { depth: null });
    const fieldName = Object.keys(payload)[0];
    if (fieldName === 'registerRequest') {
      const { id, password, email } = payload[fieldName];

      //이메일 형식 검사 필요
      await createUser(id, password, email);

      const S2CRegisterResponse = {
        success: true,
        message: 'Test',
        GlobalFailCode: 'NONE',
      };
      const gamePacket = {
        registerResponse: S2CRegisterResponse,
      };
      const result = createResponse(PacketType.REGISTER_RESPONSE, 0, gamePacket);
      console.log('Serialized response:', result);
      socket.write(result);
    }
  };

  Login = async ({ socket, payload }) => {
    console.dir(payload, { depth: null });
    const fieldName = Object.keys(payload)[0];
    if (fieldName === 'loginRequest') {
      const { id, password } = payload[fieldName];
      const sqlUserData = await findUser(id);

      const isMatch = await bcrypt.compare(password, sqlUserData[0].password);
      console.log(isMatch);
      // 없을 때 처리도 필요함
      // 일단 무조건 성공
      // JWT 추가해야됨
      const S2CLoginResponse = {
        success: isMatch,
        message: null,
        token: null,
        failCode: 'NONE',
      };
      const gamePacket = {
        loginResponse: S2CLoginResponse,
      };
      const result = createResponse(PacketType.LOGIN_RESPONSE, 0, gamePacket);
      console.log(result);
      socket.write(result);
    }
  };
}

const authHandler = new AuthHandler();
export default authHandler;
