const onClose = (socket, connectedSockets) => () => {
  connectedSockets.delete(socket.id);
};

export default onClose;
