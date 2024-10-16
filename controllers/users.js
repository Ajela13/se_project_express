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

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error(
          "The user with the provided email already exists"
        );
        error.statusCode = CONFLICT_CODE;
        throw error;
      }

      return bcrypt.hash(password, 10).then((hash) =>
        User.create({
          name,
          avatar,
          email,
          password: hash,
        })
      );
    })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).json(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "Invalid data" });
      }
      if (err.statusCode === CONFLICT_CODE) {
        return res
          .status(CONFLICT_CODE)
          .send({ message: "The user with the provided email already exists" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
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
      return res
        .status(unauthorizedError)
        .send({ message: "Incorrect email or password" });
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
