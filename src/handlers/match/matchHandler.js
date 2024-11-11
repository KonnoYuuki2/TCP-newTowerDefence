import { redis } from '../../utils/redis/redis.js';
import { v4 as uuidv4 } from 'uuid';
import { createUserData } from '../../notifications/matchNotification.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { connectedSockets } from '../../events/onConnection.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';

/**
 * 매칭 요청을 처리하는 함수
 * @param {Socket, Object} 소켓과 페이로드
 */
export const matchRequestHandler = async ({ socket, payload }) => {
  try {
    // 플레이어 정보 생성
    const player = { id: socket.id };

    // 매칭 큐에 플레이어 추가
    await redis.addToMatchQueue(player);

    // 현재 대기열에 있는 플레이어 확인
    const waitingPlayers = await redis.getMatchQueue();

    // 2명 이상이면 매칭 시작
    if (waitingPlayers.length >= 2) {
      // 앞에서부터 2명의 플레이어를 가져옴
      const [player1, player2] = waitingPlayers;

      const player1Socket = connectedSockets.get(player1.id);
      const player2Socket = connectedSockets.get(player2.id);

      if (player1Socket && player2Socket) {
        // 게임 세션 생성
        const gameId = uuidv4();
        await redis.addUser(gameId, player1.id);
        await redis.addUser(gameId, player2.id);

        player1Socket.gameId = gameId;
        player2Socket.gameId = gameId;

        // 매치 시작 알림 전송
        const { packet1, packet2 } = await createUserData(player1Socket.id, player2Socket.id);

        const packetType = HANDLER_IDS.MATCH_START_NOTIFICATION;
        const buffer1 = createResponse(
          packetType,
          player1Socket.version,
          player1Socket.sequence,
          packet1,
        );
        const buffer2 = createResponse(
          packetType,
          player2Socket.version,
          player2Socket.sequence,
          packet2,
        );

        player1Socket.write(buffer1);
        player2Socket.write(buffer2);
      }

      // 대기열에서 2명 제거
      await redis.removeMatchQueueUser(1, player1);
      await redis.removeMatchQueueUser(1, player2);
    }
  } catch (error) {
    await handleError(socket, error);
  }
};
