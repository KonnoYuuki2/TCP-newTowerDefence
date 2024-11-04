import Config from '../config/config.js';

const onData = (socket) => (data) => {
  // 버퍼를 조금씩 받는 것
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength =
    Config.PACKETS.PACKET_TYPE_LENGTH +
    Config.PACKETS.VERSION_LENGTH +
    Config.PACKETS.SEQUENCE_LENGTH;

  while (socket.buffer.length >= totalHeaderLength) {
    const packetType = socket.buffer.readUInt16BE(0); //2바이트
    const version_Length = socket.buffer.readUInt8(Config.PACKETS.PACKET_TYPE_LENGTH); //1바이트
    const version = socket.buffer.subarray(3, 3 + version_Length).toString('utf-8');
    const sequence = socket.buffer.readUInt32BE(
      Config.PACKETS.PACKET_TYPE_LENGTH +
        Config.PACKETS.VERSION_LENGTH +
        Config.PACKETS.SEQUENCE_LENGTH,
    );
    console.log(data);
    console.log(sequence); //805306368 ???
    console.log(version); // 5
    if (version !== Config.Client.VERSION) {
      throw new Error(`버전이 일치하지 않습니다.`);
    }

    //if(sequence !== ) => 패킷 호출이 지금과 같지 않다면 에러 발생 처리

    if (socket.buffer.length >= totalHeaderLength + Config.PACKETS.PAYLOAD_LENGTH) {
      const payload = socket.buffer.readUInt32BE(totalHeaderLength, Config.PACKETS.PAYLOAD_LENGTH);

      socket.buffer = socket.buffer.subarray(length);

      try {
        switch (packetType) {
        }
      } catch (error) {
        throw new Error(`패킷 변환중 에러 발생`, error);
      }
    }
  }
};

export default onData;
