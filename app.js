const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
const {
  validateUserCreated,
  validateUserLoggedIn,
} = require("./middlewares/validation");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
require("dotenv").config();

const app = express();
const { PORT = 3001 } = process.env;

const allowedOrigins = [
  "https://wtwr.casepractice.com",
  "https://www.wtwr.casepractice.com",
];

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to db");
  })
  .catch(console.error);

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(express.json());
app.use(requestLogger);

// remove after review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateUserLoggedIn, login);
app.post("/signup", validateUserCreated, createUser);
app.use("/", mainRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
