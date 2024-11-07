import net from 'net';
import Config from '../src/config/config.js';
import HANDLER_IDS from '../src/constants/handlerIds.js';
import { deserialize, serialize } from '../src/utils/serializer/serialize.js';
import { getProtoMessages, loadProtos } from '../src/init/loadProtos.js';

const client = new net.Socket();

const version = '1.0.0';

client.connect(Config.SERVER.PORT, Config.SERVER.HOST, async () => {
  console.log(`클라이언트 테스트가 연결되었습니다.`);

  await loadProtos();
  const packetType = HANDLER_IDS.TOWER_ATTACK_REQUEST;
  //const version = Config.CLIENT.VERSION;
  const sequence = 0;
  const payload = { towerAttackRequest: { towerId: 1, monsterId: 1 } };

  const protoMessages = getProtoMessages();
  const towerAttackProto = protoMessages.packets.GamePacket;

  const message = towerAttackProto.create(payload);
  const towerAttackpacket = towerAttackProto.encode(message).finish();

  const buffer = serialize(packetType, sequence, towerAttackpacket);

  client.write(buffer);
});

client.on('data', (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length >= Config.PACKETS.TOTAL_HEADER_LENGTH) {
    const deserializeData = await deserialize(socket);

    if (deserializeData.version !== version) {
      throw new Error(`서버에서 보내준 버전이 다릅니다.`);
    }

    const requiredLength = deserializeData.offset + deserializeData.payloadLength;

    if (socket.buffer.length >= requiredLength) {
      const packet = socket.buffer.subarray(deserializeData.offset, requiredLength);

      try {
        const protoMessages = getProtoMessages();

        const gamePacketProto = protoMessages.packets.GamePacket;
        const decodedPacket = gamePacketProto.decode(packet);

        console.log(`서버에서 온 패킷`, decodedPacket);
      } catch (error) {
        throw new Error(`S2C 페이로드 파싱중 에러 발생`, error);
      }
    }
  }
});
