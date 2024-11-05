const packetNames = {
  common: {
    CommonPacket: 'common.CommonPacket',
  },
  failCode: {
    GlobalFailCode: 'failCode.GlobalFailCode',
  },
  notification: {
    Position: 'notification.Position',
    BaseData: 'notification.BaseData',
    TowerData: 'notification.TowerData',
    MonsterData: 'notification.MonsterData',
    InitialGameState: 'notification.InitialGameState',
    GameState: 'notification.GameState',
  },
  packets: {
    GamePacket: 'packets.GamePacket',
  },
  response: {
    S2CResponse: 'response.S2CResponse',
  },
};

export default packetNames;
