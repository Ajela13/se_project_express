const mongoose = require("mongoose");
const validator = require("validator");

const ClothingItemsSchema = new mongoose.Schema({
  name: { type: String, require: true, minlength: 2, maxlength: 30 },
  weather: { type: String, require: true, enum: ["hot", "warm", "cold"] },
  imageUrl: {
    type: String,
    require: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
    },
    message: "You must enter a valid URL",
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  likes: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  createdAt: { type: Date, default: Data.now },
});

module.exports = mongoose.model("user", ClothingItemsSchema);
