import net from 'net';
import Config from '../src/config/config.js';
import { getProtoMessages, loadProtos } from '../src/init/loadProtos.js';
import { serialize } from '../src/utils/serializer/serialize.js';
import HANDLER_IDS from '../src/constants/handlerIds.js';

const client = new net.Socket();

const version = '1.0.0';

client.connect(Config.SERVER.PORT, Config.SERVER.HOST, async () => {
  await loadProtos();

  const packetType = HANDLER_IDS.MONSTER_ATTACK_BASE_REQUEST;
  const sequence = 0;
  const damage = 10;
  const payload = { monsterAttackBaseRequest: { damage } };

  const protoMessage = getProtoMessages();
  const gamePacketProto = protoMessage.packets.GamePacket;

  const message = gamePacketProto.create(payload);

  const baseAttackPacket = gamePacketProto.encode(message).finish();

  const buffer = serialize(packetType, sequence, baseAttackPacket);
  client.write(buffer);
});
