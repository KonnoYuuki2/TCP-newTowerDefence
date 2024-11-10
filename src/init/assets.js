import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets/');

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [gameState, monsterLevel] = await Promise.all([
      readFileAsync('gameState.json'),
      readFileAsync('monsterLevel.json'),
    ]);

    gameAssets = { gameState, monsterLevel };
    return gameAssets;
  } catch (error) {
    throw new Error('assets 파일 로드에 실패했습니다.' + error.message);
  }
};

let gameAssets = {};

export const getGameAssets = () => {
  return gameAssets;
};