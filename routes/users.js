const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  login,
  createUser,
  getCurrentUser,
  modifyCurrentUser,
} = require("../controllers/users");

router.post("/signin", login);

router.post("/signup", createUser);

router.get("/me", getCurrentUser);

router.patch("/me", modifyCurrentUser);
module.exports = router;
