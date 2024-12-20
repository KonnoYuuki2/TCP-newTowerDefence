import { createUser, findUser } from '../DB/user/user.db.js';
import { createResponse, failCodeReturn } from '../utils/response/createResponse.js';
import { PacketType } from '../constants/header.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Config from '../config/config.js';
import { connectedSockets } from '../events/onConnection.js';
import { SALTROUNDS } from '../constants/constant.js';
import { handleError } from '../utils/error/errorHandler.js';

/**
 * 회원가입 요청시 처리 함수
 * @param {socket, Object}  // socket, payload
 */
export const registerHandler = async ({ socket, payload }) => {
  try {
    const { id, password, email } = payload;
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

    const S2CRegisterResponse = {
      success: isSuccess,
      message: message,
      GlobalFailCode: failCode,
    };

    const gamePacket = {
      registerResponse: S2CRegisterResponse,
    };

    const result = createResponse(
      PacketType.REGISTER_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    socket.write(result);
  } catch (error) {
    console.error(`회원 가입 중 에러 발생`, error);
  }
};

/**
 * 로그인 요청시 처리 함수
 * @param {socket, Object}
 */
export const loginHandler = async ({ socket, payload }) => {
  try {
    const { id, password } = payload;
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
        // 로그인 시 유저의 uuid를 조회해서 소켓에 id 부여
        const uuid = sqlUserData[0].uuid;

        if (!connectedSockets.has(uuid)) {
          message = '성공';
          const data = { id: id };
          const options = { expiresIn: '6h' };
          token = jwt.sign(data, Config.SERVER.JWT_SECRETKEY, options);
          isSuccess = true;
          socket.id = uuid;
          connectedSockets.set(socket.id, socket);
        } else {
          message = '이미 로그인한 유저가 있습니다.';
          isSuccess = false;
          failCode = failCodeReturn(3);
        }
      } else {
        message = '비밀번호가 틀렸습니다.';
        failCode = failCodeReturn(3);
        token = null;
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

    const result = createResponse(
      PacketType.LOGIN_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    socket.write(result);
  } catch (error) {
    console.error(`로그인 중 에러 발생`, error);
  }
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isEmptyArray(arr) {
  return Array.isArray(arr) && arr.length === 0;
}
