import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { towerAttackVerifiy } from '../../utils/towers/towerUtils.js';

export const towerAttackHandler = async ({ socket, payload }) => {
  try {
    const { towerId, monsterId } = payload;

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

    const towerAttackPacket = {
      enemyTowerAttackNotification: { towerId: towerId, monsterId: monsterId },
    };

    enemySocket.write(
      createResponse(
        PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION,
        enemySocket.version,
        enemySocket.sequence,
        towerAttackPacket,
      ),
    );
  } catch (error) {
    console.error(`타워 공격 정보 처리중 에러 발생: ${error}`);
  }
};