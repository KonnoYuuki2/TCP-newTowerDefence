import { PacketType } from '../../constants/header.js';
import pools from '../../DB/dataBase.js';
import { findUserIdByUUID } from '../../DB/user/user.db.js';
import { getOppoSocket, getOppoSocketId, hostSocketWrite } from '../socket/socketUtils.js';

export const handleError = async (socket, error) => {
  if (!(await getOppoSocket(socket))) {
    const S2CGameOverNotification = {
      isWin: true,
    };

    const hostOverPacket = {
      gameOverNotification: S2CGameOverNotification,
    };
    const hostId = await findUserIdByUUID(socket.id);

    const oppoSocketId = await getOppoSocketId(socket);

    const oppoId = await findUserIdByUUID(oppoSocketId);

    await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_GAME_LOGS, [hostId, oppoId, false]);

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
