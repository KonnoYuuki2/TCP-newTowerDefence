import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

export const towerAttackHandler = async ({ socket, payload }) => {
  try {
    const fieldName = Object.keys(payload)[0];

    const { towerId, monsterId } = payload[fieldName];

    // 타워, 몬스터 유무 검증
    await towerAttackVerifiy(towerId, monsterId, socket.id);

    // 모든 유저 정보 가져옴
    const users = await redis.getUsers(socket.gameId);

    // 유저 정보중에 socket.id랑 같지 않은 => 다른 유저의 소켓을 찾음
    const socketId = users.find((user) => {
      return user !== socket.id;
    });

    // 찾은 socketId로 connectedSockets에 조회하여 찾음
    const enemySocket = connectedSockets.get(socketId);

    const towerAttackPacket = { enemyTowerAttackNotification: { towerId: 1, monsterId: 1 } };

    enemySocket.write(
      createResponse(PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION, 0, towerAttackPacket),
    );
  } catch (error) {
    throw new Error(`타워 공격 정보 처리중 에러 발생`, error);
  }
};
