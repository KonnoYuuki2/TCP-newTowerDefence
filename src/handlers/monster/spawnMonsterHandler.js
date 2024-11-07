import { PacketType } from '../../constants/header.js';
import { connectedSockets } from '../../events/onConnection.js';
import { spawnMonster } from '../../utils/monster/monsterUtils.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const spawnMonsterRequest = async ({ socket, payload }) => {
  try {
    const { monsterId, monsterNumber } = await spawnMonster(socket);

    // 해당 함수에서 socket.id를 받아서 해줌
    const S2CSpawnMonsterResponse = {
      monsterId: monsterId,
      monsterNumber: monsterNumber,
    };
    const gamePacket = {
      spawnMonsterResponse: S2CSpawnMonsterResponse,
    };

    // enemySpawnNotfication 패킷
    const enemySpawnPacket = {
      spawnEnemyMonsterNotification: { monsterId: monsterId, monsterNumber: monsterNumber },
    };

    // 각 유저의 소켓마다 다른 패킷 전송
    connectedSockets.forEach((value, key) => {
      if (key === socket.id) {
        value.write(createResponse(PacketType.SPAWN_MONSTER_RESPONSE, 0, gamePacket));
      } else {
        value.write(
          createResponse(PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION, 0, enemySpawnPacket),
        );
      }
    });
  } catch (error) {
    throw new Error('몬스터 생성 요청중 에러 발생', error);
  }
};

// export const spawnMonsterResponse = async (socket, payload) => {
//   try {
//     const { monsterId, monsterNumber } = payload;

//     socket.write(createS2CSpawnMonsterNotification(monsterId, monsterNumber));
//     // 해당 유저의 소켓에 적기
//   } catch (error) {
//     throw new Error('몬스터 생성 응답중 에러 발생', error);
//   }
// };
// request에서 response를 반납하기 때문에 주석처리

// export const enemySpawnMonsterNotification = async (socket, payload) => {
//   try {
//     const { monsterId, monsterNumber } = payload;

//     const getEnemySocket = getEnemySocket(socket);
//     // 상대 소켓을 구하기

//     getEnemySocket.write(createS2CEnemySpawnMonsterNotification(monsterId, monsterNumber));
//   } catch (error) {
//     throw new Error('상대 몬스터 생성 중 에러 발생', error);
//   }
// };
// 미완성 코드
