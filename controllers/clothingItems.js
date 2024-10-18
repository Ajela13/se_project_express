const clothingItems = require("../models/clothingItems");

const {
  castError,
  documentNotFoundError,
  defaultError,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
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
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        res.status(403).send({ message: "You can not delete item" });
      }

      res.status(200).send(item);
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
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
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
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItemLike,
  deleteItemLike,
};
