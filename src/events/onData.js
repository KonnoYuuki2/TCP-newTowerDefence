import Config from '../config/config.js';
import { packetParser } from '../utils/parser/packetParser.js';
const onData = (socket) => async (data) => {
  // 버퍼를 조금씩 받는 것
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength =
    Config.PACKETS.PACKET_TYPE_LENGTH + // 2
    Config.PACKETS.VERSION_LENGTH + // 1
    Config.PACKETS.SEQUENCE_LENGTH; // 4

  while (socket.buffer.length >= totalHeaderLength) {
    const packetType = socket.buffer.readUInt16BE(0); //2바이트
    const version_Length = socket.buffer.readUInt8(Config.PACKETS.PACKET_TYPE_LENGTH); //1바이트
    const version = socket.buffer.subarray(3, 3 + version_Length).toString('utf-8'); // 크기 가변적 '1.0.0'=5
    const sequence = socket.buffer.readUInt32BE(
      Config.PACKETS.PACKET_TYPE_LENGTH + Config.PACKETS.VERSION_LENGTH + version_Length,
    ); //4바이트
    const payload_Length = socket.buffer.readUInt32BE(7 + version_Length); //4바이트
    if (version !== Config.ClIENT.VERSION) {
      throw new Error(`버전이 일치하지 않습니다.`);
    }

    //if(sequence !== ) => 패킷 호출이 지금과 같지 않다면 에러 발생 처리
    //패킷의 순서 보장 싱글 스레드에서는 잘 일어나지 않으나 패킷이 1,3,2 순서로 올 경우 맞게 처리하는 용도
    //console.log(sequence);

    const new_TotalHeaderLength =
      totalHeaderLength + version.length + Config.PACKETS.PAYLOAD_LENGTH;
    if (socket.buffer.length >= new_TotalHeaderLength + payload_Length) {
      const packet = socket.buffer.subarray(new_TotalHeaderLength + 2);
      // 0x0a (줄바꿈) , 0x0d (캐리지 리턴) 붙어서 +2 되어있음
      // 실제 페이로드는 헤더 + \n, \0 을 제외한 길이
      try {
        switch (packetType) {
          default:
            const { handleID, userId, payload } = packetParser(packet);
          //await handler({ handleID, userId, payload });
        }
        break;
      } catch (error) {
        throw new Error(`패킷 변환중 에러 발생`, error);
      }
    }
  }
};

export default onData;
