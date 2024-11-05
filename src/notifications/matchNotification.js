import { getProtoMessages } from '../init/loadProtos.js';

export const createMatchStartNotification = (gameId, player1, player2) => {
  const protoMessages = getProtoMessages();
  const GamePacket = protoMessages.packets.GamePacket;

  // 초기 게임 상태 설정
  const initialGameState = {
    baseHp: 100,
    towerCost: 100,
    initialGold: 1000,
    monsterSpawnInterval: 30,
  };

  // 플레이어 데이터 설정
  const playerData = {
    gold: initialGameState.initialGold,
    base: { hp: initialGameState.baseHp, maxHp: initialGameState.baseHp },
    highScore: 0,
    towers: [],
    monsters: [],
    monsterLevel: 1,
    score: 0,
    monsterPath: [],
    basePosition: { x: 0, y: 0 },
  };

  const packet = {
    matchStartNotification: {
      initialGameState: initialGameState,
      playerData: playerData,
      opponentData: playerData,
    },
  };

  return GamePacket.encode(packet).finish();
};
