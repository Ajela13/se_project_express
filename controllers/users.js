const User = require("../models/user");
const {
  castError,
  documentNotFoundError,
  defaultError,
  unauthorizedError,
} = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          return res
            .status(unauthorizedError)
            .send({ message: "Email already exists." });
        }
        if (err.name === "ValidationError") {
          return res.status(castError).send({ message: "Invalid data" });
        }
        return res
          .status(defaultError)
          .send({ message: "An error has occurred on the server" });
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      return res.status(401).send({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const modifyCurrentUser = (req, res) => {};
module.exports = { createUser, getCurrentUser, login, modifyCurrentUser };
