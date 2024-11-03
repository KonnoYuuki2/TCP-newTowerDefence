import net from "net";
import dotenv from "dotenv";
import onConnection from "./events/onConnection.js";
import initServer from "./init/initServer.js";
import Config from "./config/config.js";

dotenv.config();

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(Config.SERVER.PORT, Config.SERVER.HOST, (socket) => {
      console.log(
        `${Config.SERVER.HOST}:${Config.SERVER.PORT}로 서버가 열렸습니다.`
      );
    });
  })
  .catch((error) => {
    console.error(`서버 실행중 에러 발생!`, error);
    process.exit(1);
  });
