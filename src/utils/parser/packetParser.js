import { getProtoTypeNameByPacketType } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  const response = protoMessages.common.commonPacket;

  let packet;

  try {
    packet = response.decode(data);
  } catch {
    console.error(e);
  }

  const packetType = packet.packetType;
  const version = packet.version;
  const sequence = packet.sequence;

  // version 검증
  if (version !== config.ClIENT.VERSION) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  const { namespace, typeName } = getProtoTypeNameByPacketType(packetType);
  const payloadType = protoMessages[namespace][typeName];

  let payload;

  try {
    payload = payloadType.decode(packet.payload);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

  return { packetType, payload };
};
