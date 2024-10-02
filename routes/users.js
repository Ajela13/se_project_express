const router = require("express").Router();
router.get("/", () => {
  console.log("GET users");
});
router.get("/:userId", () => console.log("get users by id"));
router.post("/", () => console.log("post users"));
module.exports = router;
