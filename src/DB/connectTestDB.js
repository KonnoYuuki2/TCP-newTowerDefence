import { redis } from '../utils/redis/redis.js';

const testDbConnection = async (pool, dbName, dbType) => {
  try {
    //sql
    if (dbType === 'sql') {
      const [rows] = await pool.query('SELECT 1 + 1 AS solution');
      console.log(`${dbName} 테스트 쿼리 결과:`, rows[0].solution);
    } else if (dbType === 'redis') {
      const result = await pool.ping();
      console.log(`${dbName} 테스트 쿼리 결과:`, result);
    }
  } catch (error) {
    console.error(`${dbName} 테스트 쿼리 실행 중 오류 발생:`, error);
  }
};

const testRedis = async () => {
  const userData = {
    userGold: 1000,
    baseHp: 100,
    towerData: [{ towerId: 1, x: 1, y: 1 }],
    monsterData: [
      { monsetId: 1, monsetNumber: 1 },
      { monsetId: 2, monsetNumber: 2 },
    ],
    level: 1,
    score: 0,
  };

  await redis.setUserData(1, userData);

  const user1 = 12;
  const user2 = 23;

  await redis.addUser(1, user1);
  await redis.addUser(1, user2);
  const data = await redis.getUser(1, 12);
  console.log('redis: getUser', data);
};

const testAllConnections = async (pools) => {
  await testDbConnection(pools.USER_DATABASE_SQL, 'USER_DB', 'sql');
  await testDbConnection(pools.GAME_DATABASE_REDIS, 'GAME_DB', 'redis');
  await testRedis();
};

export { testDbConnection, testAllConnections };
