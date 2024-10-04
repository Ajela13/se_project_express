const clothingItems = require("../models/clothingItems");

const {
  castError,
  documentNotFoundError,
  defaultError,
} = require("../utils/errors");

module.exports.createClothingItem = (req) => {
  console.log(req.user._id);
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(defaultError).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

const updateItemLike = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

const deleteItemLike = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItemLike,
  deleteItemLike,
};
