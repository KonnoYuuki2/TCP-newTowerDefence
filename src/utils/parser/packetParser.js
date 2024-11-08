import { getProtoMessages } from '../../init/loadProtos.js';

/**
 * 페이로드 데이터를 디코딩하는 함수
 * @param { Buffer } packet
 * @returns { Object } 디코딩한 페이로드 데이터
 */
export const packetParser = (packet) => {
  try {
    const protoMessages = getProtoMessages();
    const message = protoMessages.packets.GamePacket;

    let decodedPacket;
    try {
      decodedPacket = message.decode(packet);
    } catch (e) {
      console.error(e);
    }

    return decodedPacket;
  } catch (error) {
    console.error(`패킷 파싱 중 에러 발생: ${error}`);
  }
};
