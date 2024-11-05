import dotenv from 'dotenv';

dotenv.config();

const envFiles = {
  Server: {
    PORT: process.env.PORT || 5555,
    HOST: process.env.HOST || 'localhost',
  },
  Client: {
    VERSION: process.env.VERSION,
  },
  User_DB: {
    DB_NAME: process.env.DB1_NAME,
    DB_USER: process.env.DB1_USER,
    DB_PASSWORD: process.env.DB1_PASSWORD,
    DB_PORT: process.env.DB1_SERVER_PORT,
    DB_HOST: process.env.DB1_SERVER_HOST,
  },
  GamePlay_DB: {
    DB_NAME: process.env.DB2_NAME,
    DB_PASSWORD: process.env.DB2_PASSWORD,
    DB_PORT: process.env.DB2_SERVER_PORT,
    DB_HOST: process.env.DB2_SERVER_HOST,
    DB_NUMBER: process.env.DB2_NUMBER,
  },
};

export default envFiles;
