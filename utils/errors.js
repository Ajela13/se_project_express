class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class CastError extends CustomError {
  constructor(message = "Invalid data") {
    super(message, 400);
  }
}

class DocumentNotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class DuplicationError extends CustomError {
  constructor(message = "Duplicate resource") {
    super(message, 409);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Authorization required") {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "You can not delete item") {
    super(message, 403);
  }
}

module.exports = {
  CustomError,
  CastError,
  DocumentNotFoundError,
  DuplicationError,
  UnauthorizedError,
  ForbiddenError,
};
