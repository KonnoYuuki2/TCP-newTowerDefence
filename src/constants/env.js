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
};

export default envFiles;
