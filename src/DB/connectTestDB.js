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

const testAllConnections = async (pools) => {
  await testDbConnection(pools.USER_DATABASE_SQL, 'USER_DB', 'sql');
  await testDbConnection(pools.GAME_DATABASE_REDIS, 'GAME_DB', 'redis');
};

export { testDbConnection, testAllConnections };
