import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  await loadProtos();
  await loadGameAssets();
};

export default initServer;
