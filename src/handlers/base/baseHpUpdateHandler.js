import { UserFields } from '../../constants/constant.js';
import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { stateSyncNotification } from '../../notifications/syncNotification.js';
import { baseHpVerify } from '../../utils/base/baseUtils.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const baseHpUpdateHandler = async ({ socket, payload }) => {
  try {
    const { damage } = payload;

    const baseHp = await baseHpVerify(damage, socket.id);

    // 기지 HP 업데이트
    await redis.updateUserField(socket.id, UserFields.BASE_HP, baseHp);

    // 게임 세션의 모든 유저 가져오기
    const users = await redis.getUsers(socket.gameId);
    const enemySocketId = users.find((id) => id !== socket.id);
    const enemySocket = connectedSockets.get(enemySocketId);

    // 상대방에게 기지 HP 업데이트 알림
    const S2CUpdateBaseHPNotification = {
      isOpponent: true,
      baseHp: baseHp,
    };

    const gamePacket = {
      updateBaseHpNotification: S2CUpdateBaseHPNotification,
    };

    enemySocket.write(
      createResponse(
        PacketType.UPDATE_BASE_HP_NOTIFICATION,
        enemySocket.version,
        enemySocket.sequence,
        gamePacket,
      ),
    );

    // 자신의 상태 동기화
    const buffer = await stateSyncNotification(socket);
    socket.write(buffer);

    // 게임 오버
    if (baseHp <= 0) {
      const S2CGameOverNotification = {
        isWin: false,
      };

      const hostOverPacket = {
        gameOverNotification: S2CGameOverNotification,
      };

      const oppoOverPacket = {
        gameOverNotification: { isWin: true },
      };

      socket.write(
        createResponse(
          PacketType.GAME_OVER_NOTIFICATION,
          socket.version,
          socket.sequence,
          hostOverPacket,
        ),
      );

      enemySocket.write(
        createResponse(
          PacketType.GAME_OVER_NOTIFICATION,
          enemySocket.version,
          enemySocket.sequence,
          oppoOverPacket,
        ),
      );
    }
  } catch (error) {
    console.error('몬스터 베이스 어택 처리 중 에러 발생:', error);
  }
};
