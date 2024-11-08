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

const start = { x: 50, y: 300 }; // 시작점
const end = { x: 1350, y: 300 }; // 끝점
const amplitude = 50; // y 축으로의 진폭
const frequency = 0.4; // 사인 주기 조절
const steps = 30; // 좌표 수 (너무 많으면 에러)

const path = generateSinPath(start.x, start.y, end.x, amplitude, frequency, steps);

export default path;
