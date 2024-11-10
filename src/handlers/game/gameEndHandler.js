import pools from '../../DB/dataBase.js';
import { SQL_QUERIES } from '../../DB/user/user.queries.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getScore } from '../../utils/gameState/score/scoreUtils.js';
import { deleteData } from '../../utils/redis/redis.js';

export const gameEndHandler = async ({ socket, payload }) => {
  try {
    // 게임 세션 및 유저 데이터 삭제

    const host = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_UUID, socket.id);

    const score = await getScore(socket);

    const highScore = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_HIGHSCORE_BY_ID, [
      host[0][0].id,
    ]);

    if (highScore[0][0]) {
      if (highScore[0][0] < score) {
        console.log(`하이 스코어 갱신!!`);

        await pools.USER_DATABASE_SQL.query(SQL_QUERIES.UPDATE_HIGHSCORE, [score, host[0][0].id]);
      }
    } else {
      await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_HIGHSCORE, [host[0][0].id, score]);
    }

    setTimeout(async () => {
      // 게임 세션 및 유저 데이터 삭제
      try {
        await deleteData(socket);
      } catch (error) {
        console.error(`데이터 삭제 중 에러 발생`, error);
      }
    }, 2000);
  } catch (error) {
    await handleError(socket, error);
  }
};
