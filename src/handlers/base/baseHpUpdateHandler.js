import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { baseHpVerify } from '../../utils/base/baseUtils.js';
import { redis } from '../../utils/redis/redis.js';

export const baseHpUpdateHandler = async ({ socket, payload }) => {
  try {
    const fieldName = Object.keys(payload)[0];

    const { damage } = payload[fieldName];

    const basehp = await baseHpVerify(damage, socket.id);

    // 유저와 상대 유저 추출
    const users = await redis.getUsers(socket.gameId);

    let oppoSocketId;
    let hostSocketId;
    users.forEach((user) => {
      if (user === socket.id) {
        hostSocketId = user;
      } else {
        oppoSocketId = user;
      }
    });
    const hostSocket = connectedSockets.get(hostSocketId);
    const oppoSocket = connectedSockets.get(oppoSocketId);

    const S2CUpdateBaseHPNotification = {
      isOpponent: false,
      basehp,
    };

    const hostGamePacket = {
      updateBaseHpNotification: S2CUpdateBaseHPNotification,
    };

    const oppoGamePacket = {
      updateBaseHpNotification: { isOpponent: true, basehp },
    };

    hostSocket.write(createResponse(PacketType.UPDATE_BASE_HP_NOTIFICATION, 0, hostGamePacket));
    oppoSocket.write(createResponse(PacketType.UPDATE_BASE_HP_NOTIFICATION, 0, oppoGamePacket));

    // 게임 오버
    if (basehp > 0) {
      const S2CGameOverNotification = {
        isWin: false,
      };

      const hostOverPacket = {
        gameOverNotification: S2CGameOverNotification,
      };

      const oppoOverPacket = {
        gameOverNotification: { isWin: true },
      };

      hostSocket.write(createResponse(PacketType.GAME_OVER_NOTIFICATION, 0, hostOverPacket));
      oppoSocket.write(createResponse(PacketType.GAME_OVER_NOTIFICATION, 0, oppoOverPacket));
    }
  } catch (error) {
    throw new Error(`몬스터 베이스 어택 처리 중 에러 발생`, error);
  }
};
