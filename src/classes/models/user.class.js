class User {
  constructor(socket, id) {
    this.id = id;
    this.socket = socket;
  }

  isSocketConnected() {
    return this.socket && !this.socket.destroyed;
  }
}

export default User;
