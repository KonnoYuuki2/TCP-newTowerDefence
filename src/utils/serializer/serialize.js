import Config from '../../config/config.js';
import { TOTAL_HEADER_LENGTH } from '../../constants/header.js';

export const deserialize = async (socket) => {
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

export const serialize = (packetType, version, sequence, payload) => {
  const versionBuffer = Buffer.from(version, 'utf-8'); // 버전 문자열을 버퍼로 변환
  const versionLength = versionBuffer.length;
  const payloadLength = payload.length;

  const buffer = Buffer.alloc(TOTAL_HEADER_LENGTH);
  let offset = 0;

  // packetType 쓰기 (2바이트)
  buffer.writeUInt16BE(packetType, offset);
  offset += Config.PACKETS.PACKET_TYPE_LENGTH;

  // version 길이 쓰기 (1바이트)
  buffer.writeUInt8(versionLength, offset);
  offset += Config.PACKETS.VERSION_LENGTH;

  // version 쓰기 (5바이트)
  versionBuffer.copy(buffer, offset);
  offset += versionLength;

  // sequence 쓰기 (4바이트)
  buffer.writeUInt32BE(sequence, offset);
  offset += Config.PACKETS.SEQUENCE_LENGTH;

  // payload 길이 쓰기 (4바이트)
  buffer.writeUInt32BE(payloadLength, offset);
  offset += Config.PACKETS.PAYLOAD_LENGTH;

  // payload 쓰기 (가변 길이)
  payload.copy(buffer, offset);
  offset += payloadLength;

  return buffer;
};
