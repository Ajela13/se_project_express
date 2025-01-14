const CustomError = require("./CustomError");

class DocumentNotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

module.exports = DocumentNotFoundError;
