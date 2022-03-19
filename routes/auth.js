var express = require("express");
var router = express.Router();

const { check } = require("express-validator");

const {
  signup,
  signin,
  signout,
  changePassword,
} = require("../controllers/auth");

router.post("/signup", signup); //completed

router.post("/signin", signin); //completed
router.put("/forgotPassword", changePassword);
router.get("/signout", signout); //completed

module.exports = router;
