import envFiles from "../constants/env.js";
import { PacketFields } from "../constants/header.js";

// 여러개의 변수를 import하는 것이 아닌 하나의 객체로써 import 함으로써 import 수를 줄임
const Config = {
  Client: {
    VERSION: envFiles.Client.VERSION,
  },
  SERVER: {
    PORT: envFiles.Server.PORT,
    HOST: envFiles.Server.HOST,
  },
  PACKETS: {
    PACKET_TYPE_LENGTH: PacketFields.PACKET_TYPE_LENGTH,
    VERSION_LENGTH: PacketFields.VERSION_LENGTH,
    SEQUENCE_LENGTH: PacketFields.SEQUENCE_LENGTH,
    PAYLOAD_LENGTH: PacketFields.PAYLOAD_LENGTH,
  },
};

export default Config;
