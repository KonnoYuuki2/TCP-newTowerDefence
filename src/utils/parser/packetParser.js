import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  const response = protoMessages.packets.C2SRegisterRequest;

  let packet;

  console.log(data);
  try {
    packet = response.decode(data);

    console.log(packet.id);
    console.log(packet.password);
    console.log(packet.email);
  } catch {
    console.error(e);
  }

  return {};
};
