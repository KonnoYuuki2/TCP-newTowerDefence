import { Queue, Worker } from 'bullmq';
import { redis } from '../utils/redis/redis.js';
import { createMatchStartNotification } from '../../notifications/matchNotification.js';
import { v4 as uuidv4 } from 'uuid';
import Config from '../../config/config.js';
import { serialize } from '../../utils/serializer/serialize.js';
import HANDLER_IDS from '../../constants/handlerIds.js';

const MATCH_QUEUE = 'matchQueue';
const REDIS_CONNECTION = {
  host: Config.DATA_BASE.GAME_DATABASE_REDIS.HOST,
  port: Config.DATA_BASE.GAME_DATABASE_REDIS.PORT,
  password: Config.DATA_BASE.GAME_DATABASE_REDIS.PASSWORD,
};

export const matchQueue = new Queue(MATCH_QUEUE, {
  connection: REDIS_CONNECTION,
});

const matchWorker = new Worker(
  MATCH_QUEUE,
  async (job) => {
    const waitingPlayers = await matchQueue.getWaiting();

    if (waitingPlayers.length >= 2) {
      const player1 = waitingPlayers[0];
      const player2 = waitingPlayers[1];

      // 게임 세션 생성
      const gameId = uuidv4(); // UUID로 사용

      // 두 플레이어를 게임 세션에 추가
      await redis.addUser(gameId, player1.id);
      await redis.addUser(gameId, player2.id);

      // 헤더 붙이는 부분
      const data = createMatchStartNotification();
      const packetType = HANDLER_IDS.MATCH_START_NOTIFICATION;
      const version = Config.CLIENT.VERSION;
      const sequence = 0;
      const buffer = serialize(packetType, version, sequence, data);

      // 매치 시작 알림 전송
      player1.socket.write(buffer);
      player2.socket.write(buffer);

      // 매칭된 플레이어들 큐에서 제거
      await matchQueue.remove(player1.id);
      await matchQueue.remove(player2.id);
    }
  },
  {
    connection: REDIS_CONNECTION,
  },
);
