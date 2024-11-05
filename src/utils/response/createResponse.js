import { getProtoMessages } from '../../init/loadProtos.js';

import { PACKET_TYPE, TOTAL_HEADER_LENGTH } from '../../constants/header.js';
import Config from '../../config/config.js';

export const createResponse = (packetType, failCode, version, sequence, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages.response.S2CResponse;

  const responsePayload = {
    packetType,
    failCode,
    version,
    sequence,
    data: data ? Buffer.from(JSON.stringify(data)) : null,
  };

  const buffer = Response.encode(responsePayload).finish();

  // 길이 정보와 메시지를 함께 전송
  return Buffer.from(buffer);
};
