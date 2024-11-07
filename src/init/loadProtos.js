import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import protobuf from 'protobufjs';
import packetNames from '../protobuf/packetsName.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const protoFolder = path.join(dirname, '../protobuf');

const getAllProtoFiles = (protoFolder, fileList = []) => {
  const files = fs.readdirSync(protoFolder);

  files.forEach((file) => {
    const filePath = path.join(protoFolder, file);

    //console.log(`프로토 파일 이름`, filePath);
    // 해당하는 파일이 디렉터리인지를 확인해야겟지?
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const protoFiles = getAllProtoFiles(protoFolder);

const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(
      protoFiles.map((file) => {
        return root.load(file);
      }),
    );

    for (let [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};

      //   console.log(`packageName`, packageName);
      //   console.log(`types`, types);

      for (const [protoType, typeName] of Object.entries(types)) {
        try {
          protoMessages[packageName][protoType] = root.lookupType(typeName);
        } catch (error) {
          protoMessages[packageName][protoType] = root.lookupEnum(typeName);
        }
      }
    }

    console.log(`프로토 타입 로드에 끝났습니다.`);
  } catch (error) {
    console.error(`프로토 로딩중 에러 발생`, error);
  }
};
