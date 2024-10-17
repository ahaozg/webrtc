class RtcError extends Error {
  code = 0;

  message = '';

  data = null;

  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.message = message;
    this.data = data;
    // 设置错误的名称为自定义的错误类的名称
    this.name = this.constructor.name;
    // 如果支持 Error.captureStackTrace 方法，就使用它来捕获错误的堆栈信息
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static error(code, message, data) {
    if (data) {
      return new RtcError(code, message, data);
    }
    return new RtcError(code, message);
  }
}

export default RtcError;
