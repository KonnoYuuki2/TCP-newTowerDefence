import { connectedSockets } from '../../events/onConnection.js';
import { redis } from '../redis/redis.js';
import { createResponse } from '../response/createResponse.js';

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
 * 적 소켓을 찾는 함수
 * @param {Socket} socket
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
 * @param {Socket} socket
 * @param {type} packetType
 * @returns {}
 */

export const oppoSocketWrite = async (socket, type, gamePacket) => {
  const oppoSocket = await getOppoSocket(socket);

  oppoSocket.write(createResponse(type, oppoSocket.version, oppoSocket.seqeunce, gamePacket));
};

/**
 * 내 소켓을 찾아서 write 하는 함수
 * @param {Socket} socket
 * @param {type} packetType
 * @returns {}
 */
export const hostSocketWrite = async (socket, type, gamePacket) => {
  const hostSocket = await connectedSockets.get(socket.id);

  hostSocket.write(createResponse(type, hostSocket.version, hostSocket.sequence, gamePacket));
};
