const CustomError = require("./CustomError");

class UnauthorizedError extends CustomError {
  constructor(message = "Authorization required") {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
