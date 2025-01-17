const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");
const CastError = require("../utils/errors/CastError");
const DuplicationError = require("../utils/errors/DuplicationError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const DocumentNotFoundError = require("../utils/errors/DocumentNotFoundError");

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password) {
    return next(new CastError("Email and Password are REQUIRED!"));
  }

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then(() => res.status(201).send({ name, avatar, email }))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000 && err.keyPattern.email) {
          return next(new DuplicationError("Email already exists."));
        }
        if (err.name === "ValidationError") {
          return next(new CastError("Invalid data"));
        }
        return next(err);
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return next(new CastError("Email and Password are REQUIRED!"));
  }

  // Authenticate user
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate token upon successful login
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send response with token and a 200 status code
      return res.status(200).send({
        token,
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }

      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new DocumentNotFoundError("User not found");
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new CastError("Invalid data"));
      }
      return next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new DocumentNotFoundError("User not found");
    })
    .then(() => {
      res.send({ name, avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new CastError("Invalid data"));
      }
      return next(err);
    });
};
module.exports = { createUser, login, getCurrentUser, updateCurrentUser };
