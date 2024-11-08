import { PacketType } from '../../constants/header.js';
import pools from '../../DB/dataBase.js';
import { connectedSockets } from '../../events/onConnection.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { addTower } from '../../utils/towers/towerUtils.js';

export const towerPurchaseHandler = async ({ socket, payload }) => {
  try {
    // 타워를 구입했을 때 생성된 타워의 데이터를 담는 객체
    const towerData = await addTower(socket, payload);
    // towerId를 다시 클라이언트로 보내줘야 함

    const users = await redis.getUsers(socket.gameId);

    const oppoSocketId = users.find((user) => user !== socket.id);

    const hostSocket = connectedSockets.get(socket.id);
    const oppoSocket = connectedSockets.get(oppoSocketId);

    const hostPacket = {
      towerPurchaseResponse: { towerId: towerData.towerId },
    };
    const oppoPacket = {
      addEnemyTowerNotification: { towerId: towerData.towerId, x: towerData.x, y: towerData.y },
    };

    hostSocket.write(
      createResponse(
        PacketType.TOWER_PURCHASE_RESPONSE,
        hostSocket.version,
        hostSocket.sequence,
        hostPacket,
      ),
    );
    oppoSocket.write(
      createResponse(
        PacketType.ADD_ENEMY_TOWER_NOTIFICATION,
        oppoSocket.version,
        oppoSocket.sequence,
        oppoPacket,
      ),
    );
  } catch (error) {
    console.error(`타워 구입 정보 처리 중 에러 발생: ${error}`);
  }
};
