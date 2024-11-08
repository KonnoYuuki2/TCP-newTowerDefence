import Config from '../config/config.js';
import HANDLER_IDS from '../constants/handlerIds.js';
import { redis } from '../utils/redis/redis.js';
import { createResponse } from '../utils/response/createResponse.js';

export const stateSyncNotification = async (socket) => {
  const userData = await redis.getUserData2(socket.id);

  const packetType = HANDLER_IDS.STATE_SYNC_NOTIFICATION;
  const version = Config.CLIENT.VERSION;
  const sequence = 0;
  const buffer = createResponse(packetType, sequence, userData);

  socket.write(buffer);
};
