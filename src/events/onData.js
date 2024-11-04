import Config from "../config/config.js";

const onData = (socket) => (data) => {
  // 버퍼를 조금씩 받는 것
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = Config.PACKETS.PACKET_TYPE_LENGTH + Config.PACKETS.VERSION_LENGTH + Config.PACKETS.SEQUENCE_LENGTH;

  while (socket.buffer.length >= totalHeaderLength) {
    const packetType = socket.buffer.readUInt16BE(0);
    const version = socket.buffer.readUInt8(Config.PACKETS.PACKET_TYPE_LENGTH);
    const sequence = socket.buffer.readUInt32(Config.PACKETS.PACKET_TYPE_LENGTH + Config.PACKETS.VERSION_LENGTH + Config.PACKETS.SEQUENCE_LENGTH);

    if (version !== Config.Client.VERSION) {
      throw new Error(`버전이 일치하지 않습니다.`);
    }

    //if(sequence !== ) => 패킷 호출이 지금과 같지 않다면 에러 발생 처리

    if (socket.buffer.length >= totalHeaderLength + Config.PACKETS.PAYLOAD_LENGTH) {
      const payload = socket.buffer.readUInt32(totalHeaderLength, Config.PACKETS.PAYLOAD_LENGTH);

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
