// 인증은 JWT 기반으로 할 예정이라 userId 정보를 보낼 필요가 없다

// handlerId 필드 → packetType 필드

const packetType = 2;
const versionLength = 1;

const sequence = 4; // 패킷 번호
const payloadLength = 4;

const totalLength = packetType + versionLength + sequence + payloadLength;

// 위쪽에 패킷들에 대한 정보를 저장해둔 것
const PacketFields = {
  PACKET_TYPE_LENGTH: 2,
  VERSION_LENGTH: 1,
  SEQUENCE_LENGTH: 4,
  PAYLOAD_LENGTH: 4,
  TOTAL_LENGTH: totalLength,
};

const PacketType = {
  // 회원가입 및 로그인
  REGISTER_REQUEST: 1,
  REGISTER_RESPONSE: 2,
  LOGIN_REQUEST: 3,
  LOGIN_RESPONSE: 4,

  // 매칭
  MATCH_REQUEST: 5,
  MATCH_START_NOTIFICATION: 6,

  // 상태 동기화
  STATE_SYNC_NOTIFICATION: 7,

  // 타워 구입 및 배치
  TOWER_PURCHASE_REQUEST: 8,
  TOWER_PURCHASE_RESPONSE: 9,
  ADD_ENEMY_TOWER_NOTIFICATION: 10,

  // 몬스터 생성
  SPAWN_MONSTER_REQUEST: 11,
  SPAWN_MONSTER_RESPONSE: 12,
  SPAWN_ENEMY_MONSTER_NOTIFICATION: 13,

  // 전투 액션
  TOWER_ATTACK_REQUEST: 14,
  ENEMY_TOWER_ATTACK_NOTIFICATION: 15,
  MONSTER_ATTACK_BASE_REQUEST: 16,

  // 기지 HP 업데이트 및 게임 오버
  UPDATE_BASE_HP_NOTIFICATION: 17,
  GAME_OVER_NOTIFICATION: 18,

  // 게임 종료
  GAME_END_REQUEST: 19,

  // 몬스터 사망 통지
  MONSTER_DEATH_NOTIFICATION: 20,
  ENEMY_MONSTER_DEATH_NOTIFICATION: 21,
};

export { PacketType, PacketFields };
