class RoomError extends Error {
  code = 0;

  message = '';

  data = null;

  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static error(code, message, data) {
    if (data) {
      return new RoomError(code, message, data);
    }
    return new RoomError(code, message);
  }
}

export default RoomError;
