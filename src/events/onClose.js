const onClose = (socket, connectedSockets) => async () => {
  try {
    setTimeout(async () => {
      // 게임 세션 및 유저 데이터 삭제
      try {
        connectedSockets.delete(socket.id);
      } catch (error) {
        console.error(`데이터 삭제 중 에러 발생`, error);
      }
    }, 2000);
  } catch (error) {
    console.error(`소켓 종료 중 에러 발생`, error);
  }
};

export default onClose;
