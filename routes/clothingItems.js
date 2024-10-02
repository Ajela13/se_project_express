const router = require("express").Router();
router.get("/", () => {
  console.log("GET clothing");
});
router.post("/", () => console.log("post clothing"));
router.delete("/:itemsId", () => console.log("delete clothing by id"));
module.exports = router;
