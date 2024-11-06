import { getProtoMessages } from '../../init/loadProtos.js';
import { monsterDeath } from '../../utils/monster/monsterUtils.js';

export const monsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;

    const uuid = await getUserBySocket(socket);
    // 데이터에서 uuid가져오기

    await monsterDeath(uuid, monsterId);

    const protoMessages = getProtoMessages()
    const monsterData = protoMessages.notification.MonsterData
    const C2SMonsterDeathNotification = {
        monsterId : monsterId
    }
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};

export const enemyMonsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;

    const uuid = await getUserBySocket(socket);
    // 데이터에서 uuid가져오기

    await monsterDeath(uuid, monsterId);
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};
