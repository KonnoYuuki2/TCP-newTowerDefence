import { getProtoMessages } from '../init/loadProtos.js';
import { redis } from '../utils/redis/redis.js';

export const createMatchStartNotification = async (player1Socket, player2Socket) => {
  const protoMessages = getProtoMessages();
  const GamePacket = protoMessages.packets.GamePacket;

  // 초기 게임 상태 설정
  const initialGameState = {
    baseHp: 100,
    towerCost: 100,
    initialGold: 1000,
    monsterSpawnInterval: 50,
  };

  // 플레이어 데이터 설정
  const playerData = {
    gold: initialGameState.initialGold,
    base: { hp: initialGameState.baseHp, maxHp: initialGameState.baseHp },
    highScore: 0,
    towers: [
      { towerId: 1, x: 500, y: 350 },
      { towerId: 2, x: 550, y: 300 },
      { towerId: 3, x: 450, y: 250 },
    ],
    monsters: [
      { monsterId: 1, monsterNumber: 1 },
      { monsterId: 2, monsterNumber: 2 },
    ],
    monsterLevel: 1,
    score: 0,
    monsterPath: [
      { x: 0, y: 300 },
      { x: 1500, y: 300 },
    ],
    basePosition: { x: 1350, y: 300 },
  };

  const packet = {
    matchStartNotification: {
      initialGameState: initialGameState,
      playerData: playerData,
      opponentData: playerData,
    },
  };

  const userData = {
    userGold: playerData.userGold,
    baseHp: playerData.base.maxHp,
    towerData: playerData.towers,
    monsterData: playerData.monsters,
    level: playerData.monsterLevel,
    score: playerData.score,
  };

  await redis.setUserData(player1Socket.id, userData);
  await redis.setUserData(player2Socket.id, userData);

  return GamePacket.encode(packet).finish();
};
