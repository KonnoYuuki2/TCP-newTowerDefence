import net from 'net';
import onConnection from './events/onConnection.js';
import initServer from './init/initServer.js';
import Config from './config/config.js';
import pools from './DB/dataBase.js';
import { testAllConnections } from './DB/connectTestDB.js';
const server = net.createServer(onConnection);

async function dataBase_Connect_Test() {
  await testAllConnections(pools);
}

const startServer = async () => {
  try {
    await initServer();

    server.listen(Config.SERVER.PORT, Config.SERVER.HOST, (socket) => {
      console.log(`${Config.SERVER.HOST}:${Config.SERVER.PORT}로 서버가 열렸습니다.`);
      dataBase_Connect_Test();
    });
  } catch (error) {
    console.error(`서버 실행중 에러 발생!`, error);
    process.exit(1);
  }
};

startServer();
