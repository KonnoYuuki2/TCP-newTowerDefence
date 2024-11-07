export function getRandomPositionNearLine() {
  const start = { x: 50, y: 300 }; // 시작점
  const end = { x: 1350, y: 300 }; // 끝점
  const maxDistance = 100; // 범위

  // 경로의 시작과 끝 지점
  const startX = start.x;
  const startY = start.y;
  const endX = end.x;
  const endY = end.y;

  // 선 위의 랜덤한 지점을 선택하기 위한 t 값
  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  // 오차 범위 내에서의 y축으로 랜덤한 위치 오프셋 추가
  const offsetX = 0; // x축으로는 선을 따라가므로 오차 없음
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}
