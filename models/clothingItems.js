const mongoose = require("mongoose");
const validator = require("validator");

const ClothingItemsSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, required: true, enum: ["hot", "warm", "cold"] },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
    },
    message: "You must enter a valid URL",
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  createdAt: { type: Date, default: Data.now },
});

module.exports = mongoose.model("user", ClothingItemsSchema);
