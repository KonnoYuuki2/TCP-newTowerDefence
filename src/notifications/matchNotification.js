import path from '../utils/path/createPath.js';
import { redis } from '../utils/redis/redis.js';
import { getRandomPositionNearLine } from '../utils/towers/createInitTower.js';

export const createUserData = async (userId1, userId2) => {
  // 초기 게임 상태 설정
  const initialGameState = {
    baseHp: 100,
    towerCost: 100,
    initialGold: 1000,
    monsterSpawnInterval: 50,
  };

  const towers1 = [];
  for (let i = 0; i < 3; i++) {
    const towerPosition = getRandomPositionNearLine();
    const towerId = i + 1;
    towers1.push({ towerId, ...towerPosition });
  }

  // 플레이어 데이터 설정
  const playerData = {
    userGold: initialGameState.initialGold,
    base: { hp: initialGameState.baseHp, maxHp: initialGameState.baseHp },
    highScore: 0,
    towers: [...towers1],
    monsters: [
      // { monsterId: 1, monsterNumber: 1 },
      // { monsterId: 2, monsterNumber: 2 },
    ],
    monsterLevel: 1,
    score: 0,
    monsterPath: [...path],
    basePosition: { x: 1350, y: 300 },
  };

  const towers2 = [];
  for (let i = 3; i < 6; i++) {
    const towerPosition = getRandomPositionNearLine();
    const towerId = i + 1;
    towers2.push({ towerId, ...towerPosition });
  }

  const opponentData = {
    userGold: initialGameState.initialGold,
    base: { hp: initialGameState.baseHp, maxHp: initialGameState.baseHp },
    highScore: 0,
    towers: [...towers2],
    monsters: [
      // { monsterId: 1, monsterNumber: 1 },
      // { monsterId: 2, monsterNumber: 2 },
    ],
    monsterLevel: 1,
    score: 0,
    monsterPath: [...path],
    basePosition: { x: 1350, y: 300 },
  };

  const packet1 = {
    matchStartNotification: {
      initialGameState: initialGameState,
      playerData: playerData,
      opponentData: opponentData,
    },
  };

  const packet2 = {
    matchStartNotification: {
      initialGameState: initialGameState,
      playerData: opponentData,
      opponentData: playerData,
    },
  };

  const userData1 = {
    userGold: playerData.userGold,
    baseHp: playerData.base.maxHp,
    towerData: playerData.towers,
    monsterData: playerData.monsters,
    level: playerData.monsterLevel,
    score: playerData.score,
  };

  const userData2 = {
    userGold: opponentData.userGold,
    baseHp: opponentData.base.maxHp,
    towerData: opponentData.towers,
    monsterData: opponentData.monsters,
    level: opponentData.monsterLevel,
    score: opponentData.score,
  };

  await redis.setUserData(userId1, userData1);
  await redis.setUserData(userId2, userData2);

  return { packet1, packet2 };
};
