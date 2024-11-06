export const monsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};

export const enemyMonsterDeathNotification = async (socket, payload) => {
  try {
    const { monsterId } = payload;
  } catch (error) {
    throw new Error('몬스터 생성 중 에러 발생', error);
  }
};
