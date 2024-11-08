import HANDLER_IDS from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { towerAttackHandler } from './towers/towerAttack.js';
import { matchRequestHandler } from './match/matchHandler.js';
import { register, login } from './authHandler.js';
import { spawnMonsterRequest } from './monster/spawnMonsterHandler.js';
import { monsterDeathHandler } from './monster/monsterDeathHandler.js';
const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    packetType: register,
    protoType: 'C2SRegisterRequest',
  },
  [HANDLER_IDS.REGISTER_RESPONSE]: {
    packetType: undefined,
    protoType: 'S2CRegisterResponse',
  },
  [HANDLER_IDS.LOGIN_REQUEST]: {
    packetType: login,
    protoType: 'C2SLoginRequest',
  },
  [HANDLER_IDS.LOGIN_RESPONSE]: {
    packetType: undefined,
    protoType: 'S2CLoginResponse',
  },
  [HANDLER_IDS.MATCH_REQUEST]: {
    packetType: matchRequestHandler,
    protoType: 'C2SMatchRequest',
  },
  [HANDLER_IDS.MATCH_START_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CMatchStartNotification',
  },
  [HANDLER_IDS.STATE_SYNC_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CStateSyncNotification',
  },
  [HANDLER_IDS.TOWER_PURCHASE_REQUEST]: {
    packetType: undefined,
    protoType: 'C2STowerPurchaseRequest',
  },
  [HANDLER_IDS.TOWER_PURCHASE_RESPONSE]: {
    packetType: undefined,
    protoType: 'S2CTowerPurchaseResponse',
  },
  [HANDLER_IDS.ADD_ENEMY_TOWER_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CAddEnemyTowerNotification',
  },
  [HANDLER_IDS.SPAWN_MONSTER_REQUEST]: {
    packetType: spawnMonsterRequest,
    protoType: 'C2SSpawnMonsterRequest',
  },
  [HANDLER_IDS.SPAWN_MONSTER_RESPONSE]: {
    packetType: undefined,
    protoType: 'S2CSpawnMonsterResponse',
  },
  [HANDLER_IDS.SPAWN_ENEMY_MONSTER_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CSpawnEnemyMonsterNotification',
  },
  [HANDLER_IDS.TOWER_ATTACK_REQUEST]: {
    packetType: towerAttackHandler,
    protoType: 'C2STowerAttackRequest',
  },
  [HANDLER_IDS.ENEMY_TOWER_ATTACK_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CEnemyTowerAttackNotification',
  },
  [HANDLER_IDS.MONSTER_ATTACK_BASE_REQUEST]: {
    packetType: undefined,
    protoType: 'C2SMonsterAttackBaseRequest',
  },
  [HANDLER_IDS.UPDATE_BASE_HP_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CUpdateBaseHPNotification',
  },
  [HANDLER_IDS.GAME_OVER_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CGameOverNotification',
  },
  [HANDLER_IDS.GAME_END_REQUEST]: {
    packetType: undefined,
    protoType: 'C2SGameEndRequest',
  },
  [HANDLER_IDS.MONSTER_DEATH_NOTIFICATION]: {
    packetType: monsterDeathHandler,
    protoType: 'C2SMonsterDeathNotification',
  },
  [HANDLER_IDS.ENEMY_MONSTER_DEATH_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CEnemyMonsterDeathNotification',
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
    if (!packetType) {
      console.error(`핸들러를 찾을 수 없습니다: ID ${packetType}:`, error);
    }

    const handlerFunction = packetTypes[packetType].packetType;
    if (!handlerFunction) {
      console.error(`패킷 타입 ${packetType}에 대한 핸들러가 없습니다.:`, error);
    }

    await handlerFunction({ socket, payload });
  } catch (error) {
    console.error(`핸들러 실행 중 에러 발생:`, error);
  }
};
