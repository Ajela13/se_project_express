const CustomError = require("./CustomError");

class CastError extends CustomError {
  constructor(message = "Invalid data") {
    super(message, 400);
  }
}

module.exports = CastError;
