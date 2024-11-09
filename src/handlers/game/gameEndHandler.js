import pools from '../../DB/dataBase.js';
import { SQL_QUERIES } from '../../DB/user/user.queries.js';
import { getScore } from '../../utils/gameState/score/scoreUtils.js';
import { deleteData } from '../../utils/redis/redis.js';

export const gameEndHandler = async ({ socket, payload }) => {
  try {
    // 게임 세션 및 유저 데이터 삭제

    console.log(`들어옴`);

    const host = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_USER_BY_UUID, socket.id);

    const score = await getScore(socket);

    const highScore = await pools.USER_DATABASE_SQL.query(SQL_QUERIES.FIND_HIGHSCORE_BY_ID, [
      host[0][0].id,
    ]);

    console.log(`2번 쨰`);
    if (highScore[0][0]) {
      console.log('3번 째', highScore[0][0]);
      if (highScore[0][0] < score) {
        console.log(`하이 스코어 갱신!!`);

        await pools.USER_DATABASE_SQL.query(SQL_QUERIES.UPDATE_HIGHSCORE, [score, host[0][0].id]);
      }
    } else {
      console.log(`else 조건 확인`);
      await pools.USER_DATABASE_SQL.query(SQL_QUERIES.CREATE_HIGHSCORE, [host[0][0].id, score]);
    }

    await deleteData(socket);
  } catch (error) {
    console.error('게임 종료 처리 중 오류 발생:', error);
  }
};
