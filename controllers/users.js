const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  castError,
  documentNotFoundError,
  defaultError,
  duplicationError,
  unauthorizedError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(castError)
      .send({ message: "Email and Password are REQUIRED!" });
  }

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then(() => res.status(201).send({ name, avatar, email }))
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
      .status(castError)
      .send({ message: "Email and Password are REQUIRED!" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(unauthorizedError)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
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

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then(() => {
      res.send({ name, avatar });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports = { createUser, login, getCurrentUser, updateCurrentUser };
