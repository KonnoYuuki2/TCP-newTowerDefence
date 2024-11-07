import Config from '../config/config.js';

export const maketNotificationPacket = (packet, type) => {
  const packetType = Buffer.alloc(Config.PACKETS.PACKET_TYPE_LENGTH);
  packetType.writeUInt16BE(type, 0);

  // notification은 응답이 아니니까 failCode가 필요없지 않을까...

  const version = Buffer.alloc(Config.PACKETS.VERSION_LENGTH);
  version.writeUInt8(Config.CLIENT.VERSION, 0);

  const sequence = Buffer.alloc(Config.PACKETS.SEQUENCE_LENGTH);
  // 여기서 모종의 시퀀스가 필요한 것 같습니다.
  sequence.writeUInt32BE(0, 0);

  const payload = Buffer.alloc(Config.PACKETS.PAYLOAD_LENGTH);
  payload.writeUInt32BE(payload, 0);

  return Buffer.concat([packetType, version, sequence, payload]);
};
