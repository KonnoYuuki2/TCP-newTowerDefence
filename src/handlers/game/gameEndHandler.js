import pools from '../../DB/dataBase.js';
import { findHighScoreByUserId, findUserIdByUUID } from '../../DB/user/user.db.js';
import { SQL_QUERIES } from '../../DB/user/user.queries.js';
import { getScore } from '../../utils/gameState/score/scoreUtils.js';
import { deleteData } from '../../utils/redis/redis.js';

/**
 * 게임 종료 요청시 처리 함수
 * @param {socket, Object}  // socket, payload
 */
export const gameEndHandler = async ({ socket, payload }) => {
  try {
    // 게임 세션 및 유저 데이터 삭제

    const hostId = await findUserIdByUUID(socket.id);

    const score = await getScore(socket);

    const highScore = await findHighScoreByUserId(hostId);

    if (highScore) {
      if (highScore < score) {
        await pools.USER_DATABASE_SQL.query(SQL_QUERIES.UPDATE_HIGHSCORE, [score, hostId]);
      }
    } else {
      await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_HIGHSCORE, [hostId, score]);
    }

    await deleteData(socket);
  } catch (error) {
    console.error('게임 종료 처리 중 오류 발생:', error);
  }
};
