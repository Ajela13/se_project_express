require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
const {
  validateUserCreated,
  validateUserLoggedIn,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
const DocumentNotFoundError = require("./utils/errors/DocumentNotFoundError");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to db");
  })
  .catch(console.error);

const allowedOrigins = [ 
  'https://startling-crepe-a80270.netlify.app/',
  'https://67f70db44b68fcfd0409bd47--startling-crepe-a80270.netlify.app/'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // importante si usas cookies o headers con tokens
}));

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

app.use((req, res, next) => {
  next(new DocumentNotFoundError("Requested resources not found"));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
