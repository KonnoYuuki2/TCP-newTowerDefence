import { PacketType } from '../../constants/header.js';
import { getOppoSocket, hostSocketWrite } from '../socket/socketUtils.js';

export const handleError = async (socket, error) => {
  if (!(await getOppoSocket(socket))) {
    const S2CGameOverNotification = {
      isWin: true,
    };

    const hostOverPacket = {
      gameOverNotification: S2CGameOverNotification,
    };

    await hostSocketWrite(socket, PacketType.GAME_OVER_NOTIFICATION, hostOverPacket);
  } else {
    let responseCode;
    let message;

    if (error.code) {
      responseCode = error.code;
      message = error.message;
      console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
    } else {
      responseCode = 10000; // 일반 에러 코드
      message = error.message;
      console.error(`일반 에러: ${error.message}`);
    }
  }
};
