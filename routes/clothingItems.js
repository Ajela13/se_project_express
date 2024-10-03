const { getItems, createItem } = require("../controllers/clothingItems");
const router = require("express").Router();

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemsId", () => console.log("delete clothing by id"));
module.exports = router;
