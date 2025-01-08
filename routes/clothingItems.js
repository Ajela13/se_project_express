const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateUserAndClothingId,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  updateItemLike,
  deleteItemLike,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.use(auth);
router.post("/", validateClothingItem, createItem);
router.delete("/:itemId", validateUserAndClothingId, deleteItem);
router.put("/:itemId/likes", validateUserAndClothingId, updateItemLike);
router.delete("/:itemId/likes", validateUserAndClothingId, deleteItemLike);
module.exports = router;
