import HANDLER_IDS from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';

const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    packetType: undefined,
    protoType: 'C2SRegisterRequest',
  },
  [HANDLER_IDS.REGISTER_RESPONSE]: {
    packetType: undefined,
    protoType: 'S2CRegisterResponse',
  },
  [HANDLER_IDS.LOGIN_REQUEST]: {
    packetType: undefined,
    protoType: 'C2SLoginRequest',
  },
  [HANDLER_IDS.LOGIN_RESPONSE]: {
    packetType: undefined,
    protoType: 'S2CLoginResponse',
  },
  [HANDLER_IDS.MATCH_REQUEST]: {
    packetType: undefined,
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
    packetType: undefined,
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
    packetType: undefined,
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
    packetType: undefined,
    protoType: 'C2SMonsterDeathNotification',
  },
  [HANDLER_IDS.ENEMY_MONSTER_DEATH_NOTIFICATION]: {
    packetType: undefined,
    protoType: 'S2CEnemyMonsterDeathNotification',
  },
};

export const getPacketType = (packetType) => {
  if (!packetTypes[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${packetType}`,
    );
  }
  return packetTypes[packetType].packetType;
};

export const getProtoTypeNameByPacketType = (packetType) => {
  if (!packetTypes[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${packetType}`,
    );
  }
  return packetTypes[packetType].protoType;
};
