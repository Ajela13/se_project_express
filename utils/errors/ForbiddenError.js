const CustomError = require("./CustomError");

class ForbiddenError extends CustomError {
  constructor(message = "You can not delete item") {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
