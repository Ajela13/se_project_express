const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateUser, updateCurrentUser);
module.exports = router;
