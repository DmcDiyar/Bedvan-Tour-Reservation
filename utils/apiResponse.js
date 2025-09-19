class APIResponse {
  constructor(success, data = null, message = '', statusCode = 200) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }

  static success(
    data = null,
    message = 'Request successful',
    statusCode = 200,
  ) {
    return new APIResponse(true, data, message, statusCode);
  }

  static error(message = 'Request failed', statusCode = 500, data = null) {
    return new APIResponse(false, data, message, statusCode);
  }
}

module.exports = APIResponse;
