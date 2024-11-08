import { createUser, findUser } from '../DB/user/user.db.js';
import { createResponse, failCodeReturn } from '../utils/response/createResponse.js';
import { PacketType } from '../constants/header.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Config from '../config/config.js';

const SALTROUNDS = 10;
export const register = async ({ socket, payload }) => {
  //console.dir(payload, { depth: null });
  const fieldName = Object.keys(payload)[0];
  if (fieldName === 'registerRequest') {
    const { id, password, email } = payload[fieldName];
    const uuid = uuidv4();
    const isEmail = isValidEmail(email);
    const isUserRegistered = isEmptyArray(await findUser(id));
    let message = '';
    let isSuccess = false;
    let failCode = failCodeReturn(0);

    if (isEmail && isUserRegistered) {
      const newPassword = await bcrypt.hash(password, SALTROUNDS);
      await createUser(id, uuid, newPassword, email);
      message = '계정이 정상적으로 생성되었습니다.';
      isSuccess = true;
    } else {
      if (!isEmail) {
        message = '이메일 형식이 아닙니다.';
        console.log('이메일 형식 틀림.');
        failCode = failCodeReturn(3);
      } else if (!isUserRegistered) {
        message = '이미 존재하는 유저입니다.';
        console.log('존재하는 유저 있음.');
        failCode = failCodeReturn(3);
      }
    }
    // const code = protoMessages.failCode.GlobalFailCode;
    // failCode = code.encode(failCode);
    const S2CRegisterResponse = {
      success: isSuccess,
      message: message,
      GlobalFailCode: failCode,
    };
    const gamePacket = {
      registerResponse: S2CRegisterResponse,
    };
    const result = createResponse(PacketType.REGISTER_RESPONSE, 0, gamePacket);
    socket.write(result);
  }
};
export const login = async ({ socket, payload }) => {
  //console.dir(payload, { depth: null });
  const fieldName = Object.keys(payload)[0];
  if (fieldName === 'loginRequest') {
    const { id, password } = payload[fieldName];

    const sqlUserData = await findUser(id);
    const isUserRegistered = isEmptyArray(sqlUserData);
    let isSuccess = false;
    let message = '';
    let token;
    let failCode = failCodeReturn(0);
    if (isUserRegistered) {
      message = '없는 유저입니다.';
      failCode = failCodeReturn(3);
    } else {
      const isMatch = await bcrypt.compare(password, sqlUserData[0].password);
      if (isMatch) {
        message = '성공';
        const data = { id: id };
        const options = { expiresIn: '6h' };
        token = jwt.sign(data, Config.SERVER.JWT_SECRETKEY, options);
        isSuccess = true;
      } else {
        message = '비밀번호가 틀렸습니다.';
        failCode = failCodeReturn(3);
        const token = null;
      }
    }

    const S2CLoginResponse = {
      success: isSuccess,
      message: message,
      token: token,
      failCode: failCode,
    };
    const gamePacket = {
      loginResponse: S2CLoginResponse,
    };
    const result = createResponse(PacketType.LOGIN_RESPONSE, 0, gamePacket);
    //console.log(result);
    socket.write(result);
  }
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isEmptyArray(arr) {
  return Array.isArray(arr) && arr.length === 0;
}

function getFailCode(number) {}
