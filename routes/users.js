const router = require("express").Router();
const { getUsers, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", () => console.log("get users by id"));
router.post("/", createUser);
module.exports = router;
