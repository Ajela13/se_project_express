const User = require("../models/user");
const {
  castError,
  documentNotFoundError,
  defaultError,
  duplicationError,
} = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(castError)
      .send({ message: "Email and Password are REQUIRED!" });
  }

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, hash })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000 && err.keyPattern.email) {
          return res
            .status(duplicationError)
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
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and Password are REQUIRED!" });
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "email or password not found" });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res.status(401).send({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((userId) => {
      if (!userId) {
        return res.status(castError).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
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
