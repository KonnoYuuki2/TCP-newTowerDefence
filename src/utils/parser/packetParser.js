import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  const response = protoMessages.packets.C2SRegisterRequest;

  let packet;

  try {
    packet = response.decode(data);
    console.log(packet);
  } catch {
    console.error(e);
  }

  return {};
};
