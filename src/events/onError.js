const onError = (socket) => async (error) => {
  try {
    console.error(`소켓 에러 발생`, error);
    // 게임 세션 및 유저 데이터 삭제
    await deleteData(socket);
  } catch (error) {
    console.error(`소켓 에러 발생`, error);
  }
};

export default onError;
