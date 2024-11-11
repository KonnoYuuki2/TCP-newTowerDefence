/**
 * 몬스터가 지나가는 길을 생성하는 함수
 * @param {Number} startX // 시작점 x
 * @param {Number} startY // 시작점 y
 * @param {Number} endX // 끝점 x
 * @param {Number} amplitude // y축 진폭
 * @param {Number} frequency // 사인 주기
 * @param {Number} steps // 좌표 갯수
 * @returns {Array} {x: x y: y }로 이루어진 배열
 */
const generateSinPath = (startX, startY, endX, amplitude, frequency, steps) => {
  const path = [];
  const deltaX = (endX - startX) / steps; // x 좌표의 증가 폭

  for (let i = 0; i <= steps; i++) {
    const x = startX + i * deltaX;
    const y = startY + amplitude * Math.sin(frequency * i);
    path.push({ x, y });
  }

  return path;
};

const start = { x: 50, y: 300 };
const end = { x: 1350, y: 300 };
const amplitude = 50;
const frequency = 0.4;
const steps = 30;

const path = generateSinPath(start.x, start.y, end.x, amplitude, frequency, steps);

export default path;
