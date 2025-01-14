module.exports = (err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;

  if (!statusCode) {
    console.error("Invalid status code:", err); // Log the invalid error if statusCode is missing
  }
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
};
