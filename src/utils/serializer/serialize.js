import Config from '../../config/config.js';

export const serialize = async (socket) => {
  let offset = 0;

  const packetType = socket.buffer.readUInt16BE(offset); //2바이트
  offset += Config.PACKETS.PACKET_TYPE_LENGTH;

  const versionLength = socket.buffer.readUInt8(offset); //1바이트
  offset += +Config.PACKETS.VERSION_LENGTH;

  const version = socket.buffer.subarray(offset, offset + versionLength).toString('utf-8'); // 크기 가변적 '1.0.0'=5
  offset += versionLength;

  const sequence = socket.buffer.readUInt32BE(offset); //4바이트
  offset += Config.PACKETS.SEQUENCE_LENGTH;

  const payloadLength = socket.buffer.readUInt32BE(offset); //4바이트
  offset += Config.PACKETS.PAYLOAD_LENGTH;

  return { packetType, version, sequence, payloadLength, offset };
};
