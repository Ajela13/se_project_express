const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to db");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "66fedb4ce179c7280ae8a54b",
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
