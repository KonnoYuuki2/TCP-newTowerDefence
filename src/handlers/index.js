import HANDLER_IDS from '../constants/handlerIds.js';
import { towerAttackHandler } from './towers/towerAttackHandler.js';
import { matchRequestHandler } from './match/matchHandler.js';
import { registerHandler, loginHandler } from './authHandler.js';
import { spawnMonsterRequest } from './monster/spawnMonsterHandler.js';
import { monsterDeathHandler } from './monster/monsterDeathHandler.js';
import { baseHpUpdateHandler } from './base/baseHpUpdateHandler.js';
import { towerPurchaseHandler } from './towers/towerPurchaseHandler.js';
import { gameEndHandler } from './game/gameEndHandler.js';
import CustomError from '../utils/error/customError.js';

const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    packetType: registerHandler,
    protoType: 'C2SRegisterRequest',
  },
  [HANDLER_IDS.LOGIN_REQUEST]: {
    packetType: loginHandler,
    protoType: 'C2SLoginRequest',
  },
  [HANDLER_IDS.MATCH_REQUEST]: {
    packetType: matchRequestHandler,
    protoType: 'C2SMatchRequest',
  },
  [HANDLER_IDS.TOWER_PURCHASE_REQUEST]: {
    packetType: towerPurchaseHandler,
    protoType: 'C2STowerPurchaseRequest',
  },
  [HANDLER_IDS.SPAWN_MONSTER_REQUEST]: {
    packetType: spawnMonsterRequest,
    protoType: 'C2SSpawnMonsterRequest',
  },
  [HANDLER_IDS.TOWER_ATTACK_REQUEST]: {
    packetType: towerAttackHandler,
    protoType: 'C2STowerAttackRequest',
  },
  [HANDLER_IDS.MONSTER_ATTACK_BASE_REQUEST]: {
    packetType: baseHpUpdateHandler,
    protoType: 'C2SMonsterAttackBaseRequest',
  },
  [HANDLER_IDS.GAME_END_REQUEST]: {
    packetType: gameEndHandler,
    protoType: 'C2SGameEndRequest',
  },
  [HANDLER_IDS.MONSTER_DEATH_NOTIFICATION]: {
    packetType: monsterDeathHandler,
    protoType: 'C2SMonsterDeathNotification',
  },
};

/**
 * 패킷타입에 맞는 핸들러로 분배해주는 함수
 * @param {Socket} socket
 * @param {Number} packetType
 * @param {Object} payload
 */
export const handler = async (socket, packetType, payload) => {
  try {
    const handlerFunction = packetTypes[packetType].packetType;
    if (!handlerFunction) {
      throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `핸들러를 찾을 수 없습니다`);
    }

    await handlerFunction({ socket, payload });
  } catch (error) {
    console.error(error.message, error);
  }
};
