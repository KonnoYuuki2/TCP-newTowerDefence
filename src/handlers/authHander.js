import { createUser, findUser } from '../DB/user/user.db.js';
import { getProtoMessages } from '../init/loadProtos.js';
import Config from '../config/config.js';
import { handler } from './index.js';
import { buffer } from 'protocol-buffers/compile.js';

class AuthHandler {
  constructor() {
    Object.freeze(this);
  }
  createUser = async (payload) => {
    //console.dir(payload, { depth: null });
    const fieldName = Object.keys(payload)[0];
    if (fieldName === 'registerRequest') {
      const { id, password, email } = payload[fieldName];
      await createUser(id, password, email);
      // 대충 데이터베이스 에러
      // 리스폰
      const protoMessages = getProtoMessages();
      const message = protoMessages.packets.GamePacket;
      const S2CRegisterResponse = {
        //타입에 맞게
        success: true,
        message: 'Test',
        GlobalFailCode: 'NONE',
      };
      const GamePacket = {
        registerResponse: S2CRegisterResponse,
      };
      const data = message.encode(GamePacket).finish();
      const header = headerAdd(2, 0, data.length);
      const result = Buffer.concat([header, data]);
      console.log(result);
      return result;
    } else {
      // 패킷타입 틀림
    }
  };

  Login = async (payload) => {
    console.dir(payload, { depth: null });
    const fieldName = Object.keys(payload)[0];
    if (fieldName === 'loginRequest') {
      const { id, password } = payload[fieldName];
      const { sqlId, sqlPassword } = await findUser(id);
      // 없을 경우 에러

      // 비교 -> 틀리면 에러

      const protoMessages = getProtoMessages();
      const message = protoMessages.packets.GamePacket;
      const S2CLoginResponse = {
        //타입에 맞게
        success: true,
        message: null,
        token: null,
        failCode: 'NONE',
      };
      const GamePacket = {
        loginResponse: S2CLoginResponse,
      };
      const data = message.encode(GamePacket).finish();
      const header = headerAdd(4, 0, data.length);
      const result = Buffer.concat([header, data]);
      console.log(result);
      return result;
    }
  };
}
const headerAdd = (packetType, sequence, payloadLength) => {
  const headerLength1 =
    Config.PACKETS.PACKET_TYPE_LENGTH + // 2
    Config.PACKETS.VERSION_LENGTH; // 1

  const headerLength2 =
    Config.PACKETS.SEQUENCE_LENGTH + // 4
    Config.PACKETS.PAYLOAD_LENGTH; // 4

  let offset1 = 0;
  let offset2 = 0;
  let header1 = Buffer.alloc(headerLength1);
  let header2 = Buffer.alloc(headerLength2);

  header1.writeUInt16BE(packetType, offset1);
  offset1 += Config.PACKETS.PACKET_TYPE_LENGTH;

  header1.writeUInt8(Config.SERVER.VERSION.length, offset1);
  offset1 += Config.PACKETS.VERSION_LENGTH;

  const versionBuffer = Buffer.from(Config.SERVER.VERSION);
  header1 = Buffer.concat([header1, versionBuffer]);
  offset1 += versionBuffer.length;

  header2.writeUInt32BE(sequence, offset2);
  offset2 += Config.PACKETS.SEQUENCE_LENGTH;

  header2.writeUInt32BE(payloadLength, offset2);
  offset2 += Config.PACKETS.PAYLOAD_LENGTH;

  const result_header = Buffer.concat([header1, header2]);
  return result_header;
};

const authHandler = new AuthHandler();
export default authHandler;
