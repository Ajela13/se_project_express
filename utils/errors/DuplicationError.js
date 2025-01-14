const CustomError = require("./CustomError");

class DuplicationError extends CustomError {
  constructor(message = "Duplicate resource") {
    super(message, 409);
  }
}

module.exports = DuplicationError;
