import { CLIENT_VERSION } from '../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
export const packetParser = (data) => {
  const protoMessages = getProtoMessages();
  const response = protoMessages.S2CResponse.Packet;
  let packet;

  try {
    packet = response.decode(data);
  } catch {
    console.error(e);
  }

  const clientVersion = packet.version;
  //버전 틀림
  if (clientVersion !== CLIENT_VERSION) {
    throw Error();
  }
  console.log(clientVersion);
  return {};
};
