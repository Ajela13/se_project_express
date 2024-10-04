const {
  getItems,
  createItem,
  deleteItem,
  updateItemLike,
  deleteItemLike,
} = require("../controllers/clothingItems");
const router = require("express").Router();

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", updateItemLike);
router.delete("/:itemId/likes", deleteItemLike);
module.exports = router;
