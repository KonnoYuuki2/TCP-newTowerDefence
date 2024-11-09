import { getGameAssets } from '../../../init/assets.js';
import path from '../../path/createPath.js';
import { getRandomPositionNearLine } from '../../towers/createInitTower.js';

/**
 * 초기 게임 상태를 설정하는 함수
 * @returns {Object} 초기 게임 상태
 */
export const createInitialGameState = () => {
  const { data } = getGameAssets().gameState;
  return {
    baseHp: data.baseHp,
    towerCost: data.towerCost,
    initialGold: data.initialGold,
    monsterSpawnInterval: data.monsterSpawnInterval,
  };
};

/**
 * 타워 초기 배치를 생성하는 함수
 * @param {number} count 생성할 타워 개수
 * @param {number} idOffset 타워 ID 오프셋
 * @returns {Array} 초기 타워 배열
 */
export const createInitialTowers = (count, idOffset = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    towerId: i + 1 + idOffset,
    ...getRandomPositionNearLine(),
  }));
};

/**
 * 초기 플레이어 데이터를 생성하는 함수
 * @param {Object} initialGameState 초기 게임 상태
 * @param {Array} towers 초기 타워 배열
 * @param {number} score 초기 점수
 * @returns {Object} 초기화된 플레이어 데이터
 */
export const createInitialPlayerData = (initialGameState, towers, highScore = 0) => {
  const { baseHp, initialGold } = initialGameState;
  const { monsterLevel, basePosition } = getGameAssets().gameState.data;

  return {
    userGold: initialGold,
    base: { hp: baseHp, maxHp: baseHp },
    highScore: highScore,
    towers: towers,
    monsters: [],
    monsterLevel: monsterLevel,
    score: 0,
    monsterPath: [...path],
    basePosition: basePosition,
  };
};
