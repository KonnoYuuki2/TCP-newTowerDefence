import { createS2CEnemyMonsterDeathNotification } from '../../utils/monster/monsterNotification/monsterNotification.js';
import { monsterDeath } from '../../utils/monster/monsterUtils.js';

export const monsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;
    monsterDeath(socket, monsterId);

    const S2CMonsterDeathNotification = {
      monsterId: monsterId,
    };
    const gamePacket = {
      monsterDeathNotification :S2CMonsterDeathNotification
    }
    socket.write();
    // 여기 어떤 값을 적어야 하는지 잘 모르겠음
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};

export const enemyMonsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;

    const EnemyUserSocket = await getUserBySocket(socket);
    // 데이터에서 적의 socket 가져오기

    EnemyUserSocket.write(createS2CEnemyMonsterDeathNotification(monsterId));
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};
