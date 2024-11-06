import net from 'net';
import Config from '../src/config/config.js';
import HANDLER_IDS from '../src/constants/handlerIds.js';
import { serialize } from '../src/utils/serializer/serialize.js';
import { getProtoMessages, loadProtos } from '../src/init/loadProtos.js';

const client = new net.Socket();

client.connect(Config.SERVER.PORT, Config.SERVER.HOST, async () => {
  console.log(`클라이언트 테스트가 연결되었습니다.`);

  await loadProtos();
  const packetType = HANDLER_IDS.TOWER_ATTACK_REQUEST;
  const version = Config.CLIENT.VERSION;
  const sequence = 0;
  const payload = { towerId: 1, monsterId: 1 };

  const protoMessages = getProtoMessages();
  const enemyTowerAttackProto = protoMessages.packets.GamePacket;

  const message = enemyTowerAttackProto.create(payload);
  const enemyTowerAttackpacket = enemyTowerAttackProto.encode(message).finish();

  const buffer = serialize(packetType, version, sequence, enemyTowerAttackpacket);

  client.write(buffer);
});
