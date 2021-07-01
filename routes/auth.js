var express = require("express");
var router = express.Router();

const { check } = require("express-validator");

const { signup, signin, signout,changePassword } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("Register Number", "RegNo is required").not().isEmpty(),
    check("Register Number", "Invalid Register Number").isLength({
      min: 12,
      max: 12,
    }),
    check("Roll Number", "RollNo is required").not().isEmpty(),
    check("Roll Number", "Invalid Roll Number").isLength({
      min: 8,
      max: 8,
    }),
    check("Roll Number", "RollNo Pattern is Wrong").matches(
      /^\d{2}[A-Z]{2}\d{4}/
    ),
    check("Year Of Admission", "Year Of Admission is Required").not().isEmpty(),
    check("Year Of Admission", "Invalid Year Of Admission").isLength({
      min: 4,
      max: 4,
    }),

    check("Year Of Admission", "Year Of Admission must be an integer")
      .not()
      .isAlpha(),
    check("Primary Email ID", "Email is required").not().isEmpty(),
    check("Primary Email ID", "Invalid Email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  signup
); //completed

router.post(
  "/signin",
  [
    check("Primary Email ID", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("Primary Email ID", "Invalid Email").isEmail(),
  ],
  signin
); //completed
router.put("/forgotPassword", changePassword);
router.get("/signout", signout); //completed

module.exports = router;
