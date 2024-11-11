import { connectedSockets } from '../../events/onConnection.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { redis } from '../redis/redis.js';
import { createResponse } from '../response/createResponse.js';

/**
 * 적 소켓 아이디를 가져오는 함수
 * @param {*} socket
 * @returns {string}
 */
export const getOppoSocketId = async (socket) => {
  // 모든 유저 정보 가져옴
  const users = await redis.getUsers(socket.gameId);

  // 유저 정보중에 socket.id랑 같지 않은 => 다른 유저의 소켓을 찾음
  const oppoSocketId = users.find((user) => {
    return user !== socket.id;
  });

  return oppoSocketId;
};

/**
 * 적 소켓을 반환해주는 함수
 * @param {*} socket
 * @returns {socket}
 */
export const getOppoSocket = async (socket) => {
  // 모든 유저 정보 가져옴
  const users = await redis.getUsers(socket.gameId);

  // 유저 정보중에 socket.id랑 같지 않은 => 다른 유저의 소켓을 찾음
  const oppoSocketId = users.find((user) => {
    return user !== socket.id;
  });

  const oppoSocket = connectedSockets.get(oppoSocketId);

  return oppoSocket;
};

/**
 * 적 소켓을 찾아서 write 하는 함수
 * @param {*} socket
 * @param {*} packetType
 */
export const oppoSocketWrite = async (socket, type, gamePacket) => {
  try {
    const oppoSocket = await getOppoSocket(socket);
    oppoSocket.write(createResponse(type, oppoSocket.version, oppoSocket.sequence, gamePacket));
  } catch (error) {
    throw new CustomError(ErrorCodes.SOCKET_NOT_FOUND, `상대방 소켓을 찾을 수 없습니다`);
  }
};

/**
 * 내 소켓을 찾아서 write 하는 함수
 * @param {*} socket
 * @param {*} packetType
 */
export const hostSocketWrite = async (socket, type, gamePacket) => {
  try {
    const hostSocket = await connectedSockets.get(socket.id);

    hostSocket.write(createResponse(type, hostSocket.version, hostSocket.sequence, gamePacket));
  } catch (error) {
    throw new CustomError(ErrorCodes.SOCKET_NOT_FOUND, `소켓을 찾을 수 없습니다`);
  }
};
