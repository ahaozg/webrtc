class RoomResponse {
  code = 0;

  message = '';

  data = null;

  constructor(code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success(data) {
    return new RoomResponse(0, '', data || null);
  }

  static fail(code, message, data) {
    return new RoomResponse(code, message, data || null);
  }
}

export default RoomResponse;
