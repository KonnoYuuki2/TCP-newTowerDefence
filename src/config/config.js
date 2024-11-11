import envFiles from '../constants/env.js';
import { PacketFields, TOTAL_HEADER_LENGTH } from '../constants/header.js';

// 여러개의 변수를 import하는 것이 아닌 하나의 객체로써 import 함으로써 import 수를 줄임
const Config = {
  CLIENT: {
    VERSION: envFiles.Client.VERSION,
  },
  SERVER: {
    PORT: envFiles.Server.PORT,
    HOST: envFiles.Server.HOST,
    VERSION: envFiles.Server.VERSION,
    JWT_SECRETKEY: envFiles.Server.JWT_SECRETKEY,
  },
  PACKETS: {
    PACKET_TYPE_LENGTH: PacketFields.PACKET_TYPE_LENGTH,
    VERSION_LENGTH: PacketFields.VERSION_LENGTH,
    SEQUENCE_LENGTH: PacketFields.SEQUENCE_LENGTH,
    PAYLOAD_LENGTH: PacketFields.PAYLOAD_LENGTH,
    TOTAL_HEADER_LENGTH: TOTAL_HEADER_LENGTH,
  },
  DATA_BASE: {
    USER_DATABASE_SQL: {
      HOST: envFiles.User_DB.DB_HOST,
      USER: envFiles.User_DB.DB_USER,
      NAME: envFiles.User_DB.DB_NAME,
      PASSWORD: envFiles.User_DB.DB_PASSWORD,
      PORT: envFiles.User_DB.DB_PORT,
    },
    GAME_DATABASE_REDIS: {
      HOST: envFiles.GamePlay_DB.DB_HOST,
      PASSWORD: envFiles.GamePlay_DB.DB_PASSWORD,
      NAME: envFiles.GamePlay_DB.DB_NAME,
      NUMBER: envFiles.GamePlay_DB.DB_NUMBER,
      PORT: envFiles.GamePlay_DB.DB_PORT,
    },
  },
};

export default Config;
