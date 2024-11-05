import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';

export const packetParser = (packet) => {
  // version 검증
  if (version !== config.ClIENT.VERSION) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  const protoMessages = getProtoMessages();
  const message = protoMessages.packets.GamePacket;

  let decodedPacket;
  try {
    console.log('디코딩전');
    decodedPacket = message.decode(packet);
    console.log(decodedPacket);
  } catch (e) {
    console.error(e);
  }
  console.log('캣치 후');

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

  return decodedPacket;
};
