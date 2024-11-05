import Config from '../config/config.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { serialize } from '../utils/serializer/serialize.js';

const onData = (socket) => async (data) => {
  // 버퍼를 조금씩 받는 것
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length >= Config.PACKETS.TOTAL_HEADER_LENGTH) {
    // 직렬화된 데이터들
    const serializeData = await serialize(socket);

    if (version !== Config.CLIENT.VERSION) {
      throw new Error(`버전이 일치하지 않습니다.`);
    }

    //if(sequence !== ) => 패킷 호출이 지금과 같지 않다면 에러 발생 처리
    //패킷의 순서 보장 싱글 스레드에서는 잘 일어나지 않으나 패킷이 1,3,2 순서로 올 경우 맞게 처리하는 용도
    //console.log(sequence);

    const requiredLength = serializeData.offset + serializeData.payloadLength;

    if (socket.buffer.length >= requiredLength) {
      const packet = socket.buffer.subarray(serializeData.offset, requiredLength);
      socket.buffer = socket.buffer.subarray(requiredLength);

      // 0x0a (줄바꿈) , 0x0d (캐리지 리턴) 붙어서 +2 되어있음
      // 실제 페이로드는 헤더 + \n, \0 을 제외한 길이
      try {
        const payload = packetParser(packet);

        // const packetTypes = getPacketType(packetType);
        // await packetTypes({ socket, payload });
      } catch (error) {
        throw new Error(`패킷 변환중 에러 발생`, error);
      }
    }
  }
};

export default onData;
