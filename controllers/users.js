const User = require("../models/user");
const {
  castError,
  documentNotFoundError,
  defaultError,
} = require("../utils/errors");
const bcrypt = require("bcrypt");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(castError).send({ message: "Invalid data" });
        }
        if (err.code === 11000 && err.keyPattern.email) {
          return res
            .status(castError)
            .send({ message: "Email already exists." });
        }
        return res
          .status(defaultError)
          .send({ message: "An error has occurred on the server" });
      });
  });
};

const getUserById = (req, res) => {
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
module.exports = { getUsers, createUser, getUserById };
