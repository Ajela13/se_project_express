const clothingItems = require("../models/clothingItems");

const {
  CastError,
  DocumentNotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  clothingItems
    .find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new CastError());
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItems
    .findById(itemId)
    .orFail(() => {
      throw new DocumentNotFoundError("User not found");
    })
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("You cannot delete this item"); // Throw ForbiddenError when the user is not the owner
      }
      return item.deleteOne().then(() => {
        res.send({ message: "successfully deleted" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new CastError("Invalid data"));
      }
      next(err);
    });
};

const updateItemLike = (req, res, next) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new DocumentNotFoundError("Item not found");
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new CastError("Invalid data"));
      }
      next(err);
    });
};

const deleteItemLike = (req, res, next) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new DocumentNotFoundError("Item not found");
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new CastError("Invalid data"));
      }
      next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItemLike,
  deleteItemLike,
};
