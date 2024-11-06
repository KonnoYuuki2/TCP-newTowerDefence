export const spawnMonsterRequest = async (socket) => {
  try {
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};

export const spawnMonsterResponse = async (socket, payload) => {
  try {
    const { monsterId, monsterNumber } = payload;

    const user = await getUserBySocket(socket);
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};

export const enemyMonsterNotification = async (socket, payload) => {
  try {
    const { monsterId, monsterNumber } = payload;

    const user = await getUserBySocket(socket);
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};
