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
