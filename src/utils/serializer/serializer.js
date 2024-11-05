import { Config } from '../../config/config.js';

const serializer = (message, type) => {
  const packetLength = Buffer.alloc(Config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + Config.packet.totalLength + Config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(Config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};
