const packetNames = {
  failCode: {
    GlobalFailCode: "failCode.GlobalFailCode",
  },
  notification: {
    Position: "notification.Position",
    BaseData: "notification.BaseData",
    TowerData: "notification.TowerData",
    MonsterData: "notification.MonsterData",
    InitialGameState: "notification.InitialGameState",
    GameState: "notification.GameState",
  },
  packets: {
    // C2SRegisterRequest: "packets.C2SRegisterRequest",
    // S2CRegisterResponse: "packets.S2CRegisterResponse",
    // C2SLoginRequest: "packets.C2SLoginRequest",
    // S2CLoginResponse: "packets.S2CLoginResponse",
    // C2SMatchRequest: "packets.C2SMatchRequest",
    // S2CMatchStartNotification: "packets.S2CMatchStartNotification",
    // S2CStateSyncNotification: "packets.S2CStateSyncNotification",
    // C2STowerPurchaseRequest: "packets.C2STowerPurchaseRequest",
    // S2CTowerPurchaseResponse: "packets.S2CTowerPurchaseResponse",
    // S2CAddEnemyTowerNotification: "packets.S2CAddEnemyTowerNotification",
    // C2SSpawnMonsterRequest: "packets.C2SSpawnMonsterRequest",
    // S2CSpawnMonsterResponse: "packets.S2CSpawnMonsterResponse",
    // S2CSpawnEnemyMonsterNotification:
    //   "packets.S2CSpawnEnemyMonsterNotification",
    // C2STowerAttackRequest: "packets.C2STowerAttackRequest",
    // S2CEnemyTowerAttackNotification: "packets.S2CEnemyTowerAttackNotification",
    // C2SMonsterAttackBaseRequest: "packets.C2SMonsterAttackBaseRequest",
    // S2CUpdateBaseHPNotification: "packets.S2CUpdateBaseHPNotification",
    // S2CGameOverNotification: "packets.S2CGameOverNotification",
    // C2SGameEndRequest: "packets.C2SGameEndRequest",
    // C2SMonsterDeathNotification: "packets.C2SMonsterDeathNotification",
    // S2CEnemyMonsterDeathNotification:
    //   "packets.S2CEnemyMonsterDeathNotification",
    GamePacket: "packets.GamePacket",
  },
  response: {
    S2CResponse: "response.S2CResponse",
  },
};

export default packetNames;
