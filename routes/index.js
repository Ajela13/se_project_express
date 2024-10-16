const router = require("express").Router();

const userRouter = require("./users");

router.use("/users", userRouter);

const clothingRouter = require("./clothingItems");

router.get("/items", clothingRouter);

module.exports = router;
