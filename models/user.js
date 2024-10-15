const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "Wrong email format",
    },
  },
  password: { type: String, require: true },
});

module.exports = mongoose.model("user", UserSchema);
