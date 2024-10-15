const router = require("express").Router();

const { login, createUser} = require("../controllers/users");

app.post("/signin", login);

app.post("/signup", createUser);
module.exports = router;
