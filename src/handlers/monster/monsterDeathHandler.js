import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { stateSyncNotification } from '../../notifications/syncNotification.js';
import { getMonsterLevel, setMonsterLevel } from '../../utils/level/levelUtils.js';
import { monsterDeath } from '../../utils/monster/monsterUtils.js';
import { redis } from '../../utils/redis/redis.js';
import { createResponse } from '../../utils/response/createResponse.js';
import {
  calculateScore,
  getHighScore,
  getScore,
  setHighScore,
  setScore,
} from '../../utils/score/scoreUtils.js';

export const monsterDeathHandler = async ({ socket, payload }) => {
  try {
    const { monsterId } = payload;

    // await monsterDeath(socket, monsterId);

    // 몬스터가 죽었을 떄 레벨에 따라서 스코어 증가 및 갱신
    const score = await getScore(socket);

    const monsterLevel = await getMonsterLevel(socket);

    await setScore(socket, await calculateScore(score, monsterLevel));

    // 증가한 스코어가 최고 점수 갱신시 스코어 증가 및 갱신
    const increasedScore = await getScore(socket);

    // 테이블 만드는 거 부탁할게요~
    if (increasedScore % 100 === 0) {
      await setMonsterLevel(socket, monsterLevel);
    }

    const S2CEnemyMonsterDeathNotification = {
      monsterId: monsterId,
    };
    const gamePacket = {
      enemyMonsterDeathNotification: S2CEnemyMonsterDeathNotification,
    };

    // 모든 유저 정보 가져옴
    const users = await redis.getUsers(socket.gameId);

    // 유저 정보중에 socket.id랑 같지 않은 => 다른 유저의 소켓을 찾음
    const socketId = users.find((user) => {
      return user !== socket.id;
    });

    // 찾은 socketId로 connectedSockets에 조회하여 찾음
    const enemySocket = connectedSockets.get(socketId);

    enemySocket.write(
      createResponse(
        PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION,
        socket.version,
        socket.seqeunce,
        gamePacket,
      ),
    );
    const buffer = await stateSyncNotification(socket);
    socket.write(buffer);

    await monsterDeath(socket, monsterId);
  } catch (error) {
    console.error(`몬스터 처치 처리 중 에러 발생: ${error}`);
  }
};
