import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';

export const packetParser = (packet) => {
  // version 검증
  // if (version !== Config.CLIENT.VERSION) {
  //   throw new CustomError(
  //     ErrorCodes.CLIENT_VERSION_MISMATCH,
  //     '클라이언트 버전이 일치하지 않습니다.',
  //   );
  // }

  const protoMessages = getProtoMessages();
  const message = protoMessages.packets.GamePacket;

  let decodedPacket;
  try {
    decodedPacket = message.decode(packet);
  } catch (e) {
    console.error(e);
  }

  return decodedPacket;
};
