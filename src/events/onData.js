import Config from '../config/config.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { deserialize } from '../utils/serializer/serialize.js';
import { handler } from '../handlers/index.js';
import { validateSequence } from '../utils/validate/validateSequence.js';
import { validateVersion } from '../utils/validate/validateVersion.js';
import CustomError from '../utils/error/customError.js';

/**
 * 클라이언트로부터 받은 패킷을 처리하는 함수
 * @param {Socket} socket
 * @returns
 */
const onData = (socket) => async (data) => {
  try {
    // 버퍼를 조금씩 받는 것
    socket.buffer = Buffer.concat([socket.buffer, data]);

    while (socket.buffer.length >= Config.PACKETS.TOTAL_HEADER_LENGTH) {
      // 직렬화된 데이터들
      const deserializeData = await deserialize(socket);

      if (!validateVersion(socket, deserializeData.version))
        throw new CustomError(ErrorCodes.CLIENT_VERSION_MISMATCH, `버전이 일치하지 않습니다`);

      //if(sequence !== ) => 패킷 호출이 지금과 같지 않다면 에러 발생 처리
      //패킷의 순서 보장 싱글 스레드에서는 잘 일어나지 않으나 패킷이 1,3,2 순서로 올 경우 맞게 처리하는 용도
      //console.log(sequence);
      if (!validateSequence(socket, deserializeData.sequence))
        throw new CustomError(ErrorCodes.INVALID_SEQUENCE, `시퀀스가 변조되었습니다.`);

      const requiredLength = deserializeData.offset + deserializeData.payloadLength;

      if (socket.buffer.length >= requiredLength) {
        const packet = socket.buffer.subarray(deserializeData.offset, requiredLength);
        socket.buffer = socket.buffer.subarray(requiredLength);

        const payload = packetParser(packet);

        await handler(socket, deserializeData.packetType, payload);
        break;
      }
    }
  } catch (error) {
    console.error(error.message, error);
  }
};

export default onData;
