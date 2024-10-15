const auth = require("../middlewares/auth");
const router = require("express").Router();

const userRouter = require("./users");

router.use("/users", userRouter);

const clothingRouter = require("./clothingItems");

router.get("/items", clothingRouter);

router.use(auth);

const protectedClothingRouter = require("./clothingItems");
router.use("/items", protectedClothingRouter); // Apply auth to non-GET routes

module.exports = router;
