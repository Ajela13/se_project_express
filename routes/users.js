const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, modifyCurrentUser } = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", modifyCurrentUser);
module.exports = router;
