import mysql from 'mysql2/promise';
import Redis from 'ioredis';
import { formatDate } from './dataFormatter.js';
import Config from '../config/config.js';

/**
 *  DB pool 생성
 * @returns {Object}
 */
const createPoolSQL = () => {
  const pool = mysql.createPool({
    host: Config.DATA_BASE.USER_DATABASE_SQL.HOST,
    port: Config.DATA_BASE.USER_DATABASE_SQL.PORT,
    user: Config.DATA_BASE.USER_DATABASE_SQL.USER,
    password: Config.DATA_BASE.USER_DATABASE_SQL.PASSWORD,
    database: Config.DATA_BASE.USER_DATABASE_SQL.NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  const originalQuery = pool.query;
  pool.query = (sql, params) => {
    const date = new Date();

    // console.log(
    //   `[${formatDate(date)}] ${Config.DATA_BASE.USER_DATABASE_SQL.NAME} Excuting query: ${sql} ${params ? `, ${JSON.stringify(params)}` : ``}`,
    // );
    return originalQuery.call(pool, sql, params);
  };
  return pool;
};

/**
 * 레디스 pool 생성
 * @returns {function}
 */
const createPoolRedis = () => {
  const redisClient = new Redis({
    host: Config.DATA_BASE.GAME_DATABASE_REDIS.HOST,
    password: Config.DATA_BASE.GAME_DATABASE_REDIS.PASSWORD,
    db: Config.DATA_BASE.GAME_DATABASE_REDIS.NUMBER,
    port: Config.DATA_BASE.GAME_DATABASE_REDIS.PORT,
    retryStrategy: (times) => {
      return Math.min(times * 50, 4000);
    },
  });
  const originalSendCommand = redisClient.sendCommand;
  redisClient.sendCommand = function (command, ...args) {
    const date = new Date();
    const commandName = command?.name || 'Unknown Command';
    const formattedArgs = args.length ? `, ${JSON.stringify(args)}` : '';
    // console.log(
    //   `[${formatDate(date)}] ${Config.DATA_BASE.GAME_DATABASE_REDIS.NAME} Excuting query: ${commandName}${formattedArgs}`,
    // );
    return originalSendCommand.call(this, command, ...args);
  };
  return redisClient;
};
const pools = { USER_DATABASE_SQL: createPoolSQL(), GAME_DATABASE_REDIS: createPoolRedis() };
export default pools;
