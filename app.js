const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { documentNotFoundError } = require("./utils/errors");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
const {
  validateUserCreated,
  validateUserLoggedIn,
} = require("./middlewares/validation");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/loggers");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to db");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.post("/signin", validateUserLoggedIn, login);
app.post("/signup", validateUserCreated, createUser);
app.use("/", mainRouter);

app.use((req, res) => {
  res
    .status(documentNotFoundError)
    .json({ message: "Requested resource not found" });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
