import { getProtoMessages } from '../../init/loadProtos.js';
import { serialize } from '../serializer/serialize.js';

/**
 *
 * @param {number} packetType - Config.PackType 참조
 * @param {number} sequence - 패킷 순서
 * @param {GamePacket} gamePacket - 객체{ 객체:{ 데이터 ...}}
 * @returns {Buffer}
 */
export const createResponse = (packetType, sequence, gamePacket) => {
  const protoMessages = getProtoMessages();

  const Response = protoMessages.packets.GamePacket;

  const payload = Response.encode(gamePacket).finish();

  const result_Buffer = serialize(packetType, sequence, payload);

  return result_Buffer;
};
export const failCodeReturn = (number) => {
  const protoMessages = protoMessages.failCode.GlobalFailCode;
  let result;
  switch (number) {
    case 0:
      result = protoMessages.NONE;
      break;
    case 1:
      result = protoMessages.UNKNOWN_ERROR;
      break;
    case 2:
      result = protoMessages.INVALID_REQUEST;
      break;
    case 3:
      result = protoMessages.AUTHENTICATION_FAILED;
      break;
  }
  return result;
};
