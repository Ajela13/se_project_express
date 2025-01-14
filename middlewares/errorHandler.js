module.exports = (err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
};
