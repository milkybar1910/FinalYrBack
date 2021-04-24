const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getStudentById,
  getStudent,
  getBatchDetails,
  updateStudent,
  updateField,
  findForm,
  getStudentForNotification,
} = require("../controllers/student");

router.param("studentId", getStudentById);

router.get("/student/:studentId", isSignedIn, isAuthenticated, getStudent);
router.get(
  "/student/admin/:studentId",
  isSignedIn,
  isAuthenticated,
  getStudentForNotification
);

router.get(
  "/student/year/:studentId/:year",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getBatchDetails
);

router.put(
  "/student/update/:studentId",
  [
    check("Register Number", "RegNo is required").not().isEmpty(),
    check("Register Number", " Register Number must be a integer")
      .not()
      .isAlpha(),
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
    check("Title", "Title is Required").not().isEmpty(),
    check("Full Name", "Fullname is required").not().isEmpty(),

    check("First Name", "Firstname is required").not().isEmpty(),

    check("Gender", "Gender is Required").not().isEmpty(),
    check("DOB I", "DOB(DD/MM/YYYY) is Required").not().isEmpty(),
    check("DOB I", "DOB(DD/MM/YYYY) has wrong pattern").matches(
      /^\d{2}['/']{1}\d{2}['/']{1}\d{4}/
    ),
    check("DOB II", "DOB(MM/DD/YYYY) is Required").not().isEmpty(),
    check("DOB II", "DOB(MM/DD/YYYY) has wrong pattern").matches(
      /^\d{2}['/']{1}\d{2}['/']{1}\d{4}/
    ),
    check("DOB III", "DOB(YYYY-MM-DD) is Required").not().isEmpty(),
    check("DOB III", "DOB(YYYY-MM-DD) has wrong pattern").matches(
      /^\d{4}[-]{1}\d{2}[-]{1}\d{2}/
    ),
    check("College", "College is Required").not().isEmpty(),
    check("Degree", "Degree is Required").not().isEmpty(),
    check("Branch", "Branch is Required").not().isEmpty(),
    check("Section", "Section is Required").not().isEmpty(),

    check("Year Of Admission", "Year Of Admission is Required").not().isEmpty(),
    check("Year Of Admission", "Invalid Year Of Admission").isLength({
      min: 4,
      max: 4,
    }),

    check("Year Of Admission", "Year Of Admission must be an integer")
      .not()
      .isAlpha(),

    check("Tenth Percentage", "Tenth Percentage is Required").not().isEmpty(),
    check("Tenth Percentage", "Tenth Percentage mustn't be a character")
      .not()
      .isAlpha(),
    check("Tenth Board Of Study", "Tenth Board Of Study is Required")
      .not()
      .isEmpty(),

    check("Tenth Medium Of Study", "Tenth Medium Of Study is Required")
      .not()
      .isEmpty(),

    check("Tenth Year Of Passing", "Tenth Year Of Passing is Required")
      .not()
      .isEmpty(),
    check("Tenth Year Of Passing", "Invalid Tenth Year Of Passing").isLength({
      min: 4,
      max: 4,
    }),
    check("Tenth Year Of Passing", " Tenth Year Of Passing").not().isAlpha(),

    check("Tenth School Name", "Tenth School Name is Required").not().isEmpty(),

    check("Tenth Graduating State", "Tenth Graduating State is Required")
      .not()
      .isEmpty(),

    check("Twelfth Percentage", "Twelfth Percentage is required")
      .not()
      .isEmpty(),
    check("Twelfth Percentage", "Twelfth Percentage mustn't be a character")
      .not()
      .isAlpha(),
    check("Twelfth Board Of Study", "Twelfth Board Of Study is required")
      .not()
      .isEmpty(),

    check("Twelfth Medium Of Study", "Twelfth Medium Of Study is required")
      .not()
      .isEmpty(),

    check("Twelfth Year Of Passing", "Twelfth Year Of Passing is required")
      .not()
      .isEmpty(),

    check("Twelfth Year Of Passing", " Twelth Year Of Passing").not().isAlpha(),
    check(
      "Twelfth Year Of Passing",
      "Invalid Twelfth Year Of Passing"
    ).isLength({
      min: 4,
      max: 4,
    }),

    check("Twelfth School Name", "Twelfth School Name is required")
      .not()
      .isEmpty(),

    check("Twelfth Graduating State", "Twelfth Graduating State is required")
      .not()
      .isEmpty(),

    check(
      "Diploma Specilazation OR Branch",
      "Diploma Specilazation / Branch is required"
    )
      .not()
      .isEmpty(),

    check("Diploma Percentage", "Diploma Percentage is Required")
      .not()
      .isEmpty(),

    check("Diploma Year Of Passing", "Diploma Year Of Passing is required")
      .not()
      .isEmpty(),
    check("Name Of Institute", "Name Of Institute is required").not().isEmpty(),

    check("Diploma Graduating State", "Diploma Graduating State is required")
      .not()
      .isEmpty(),

    check("Sem 1 GPA", "Sem 1 GPA is required").not().isEmpty(),

    check("Sem 2 GPA", "Sem 2 GPA  is required").not().isEmpty(),

    check("Sem 3 GPA", "Sem 3 GPA is required").not().isEmpty(),

    check("Sem 4 GPA", "Sem 4 GPA is required").not().isEmpty(),

    check("Sem 5 GPA", "Sem 5 GPA is required").not().isEmpty(),

    check("Sem 6 GPA", "Sem 6 GPA is required").not().isEmpty(),

    check("Sem 7 GPA", "Sem 7 GPA is required").not().isEmpty(),

    check("Sem 8 GPA", "Sem 8 GPA is required").not().isEmpty(),

    check("Overall CGPA", "Overall CGPA is required").not().isEmpty(),
    check("Overall CGPA", "Overall CGPA shouldn't be a string").not().isAlpha(),

    check("Number Of Arrears Sem 1", "Number Of Arrears Sem1 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 1",
      "Number Of Arrears Sem1 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Number Of Arrears Sem 2", "Number Of Arrears Sem2 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 2",
      "Number Of Arrears Sem2 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Number Of Arrears Sem 3", "Number Of Arrears Sem3 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 3",
      "Number Of Arrears Sem3 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Number Of Arrears Sem 4", "Number Of Arrears Sem4 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 4",
      "Number Of Arrears Sem4 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Number Of Arrears Sem 5", "Number Of Arrears Sem5 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 5",
      "Number Of Arrears Sem5 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Number Of Arrears Sem 6", "Number Of Arrears Sem6 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 6",
      "Number Of Arrears Sem6 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Number Of Arrears Sem 7", "Number Of Arrears Sem7 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 7",
      "Number Of Arrears Sem7 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Number Of Arrears Sem 8", "Number Of Arrears Sem8 is required")
      .not()
      .isEmpty(),
    check(
      "Number Of Arrears Sem 8",
      "Number Of Arrears Sem8 shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check(
      "Total Number Of Standing Arrears",
      "Total Number Of Standing Arrears is required"
    )
      .not()
      .isEmpty(),
    check(
      "Total Number Of Standing Arrears",
      "Total Number Of Standing Arrears shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Is History Of Arrears", "History Of Arrears Field is required")
      .not()
      .isEmpty(),
    check(
      "Number Of History Of Arrears",
      "Number Of History Of Arrears is required"
    )
      .not()
      .isEmpty(),
    check(
      "Number Of History Of Arrears",
      "Number Of History Of Arrears shouldn't be a string"
    )
      .not()
      .isAlpha(),
    check("Land Line Number", "LandLine Number is required").not().isEmpty(),
    check("Primary Number", "Primary Number is required").not().isEmpty(),
    check("Primary Number", "Invalid Primary Number").isLength({
      min: 10,
      max: 10,
    }),
    check("Emergency Number", "Emergency Number is required").not().isEmpty(),
    check("Emergency Number", "Invalid Emergency Number").isLength({
      min: 10,
      max: 10,
    }),
    check("Primary Email ID", "Primary Email ID is required").not().isEmpty(),

    check("Primary Email ID", "Invalid Primary Email Id").isEmail(),
    check("Alternate Email ID", "Alternate Email ID is required")
      .not()
      .isEmpty(),
    check("Alternate Email ID", "Invalid Alternate Email Id").isEmail(),
    check("Sports Quota", "Sports Quota Field is required").not().isEmpty(),
    check("BEC Status", "BEC status is required").not().isEmpty(),
    check("BEC Grade", "BEC grade is required").not().isEmpty(),
    check("Languages Known", "Languages Known Field is required")
      .not()
      .isEmpty(),
    check("Gap In Education", "Gap In Education Field is required")
      .not()
      .isEmpty(),
    check("Is Higher Studies", "'Higher Studies Field'is required")
      .not()
      .isEmpty(),
    check("PAN Number", "PAN number is required").not().isEmpty(),
    check("Nationality", "Nationality is required").not().isEmpty(),
    check("Indian Passport Number", "Indian Passport Number is required")
      .not()
      .isEmpty(),
    check("Aadhaar Number", "AadhaarNumber is required").not().isEmpty(),

    check("Father Name", "Father Name is required").not().isEmpty(),
    check("Father Designation", "Father Designation is required")
      .not()
      .isEmpty(),
    check("Father Organization", "Father Organization is required")
      .not()
      .isEmpty(),
    check("Father Mobile Number", "Father MobileNumber is required")
      .not()
      .isEmpty(),

    check("Father Mail ID", "Father Mail ID is required").not().isEmpty(),

    check("Mother Name", "Mother Name is required").not().isEmpty(),
    check("Mother Designation", "Mother Designation is required")
      .not()
      .isEmpty(),
    check("Mother Organization", "Mother Organization is required")
      .not()
      .isEmpty(),
    check("Mother Mobile Number", "Mother Mobile Number is required")
      .not()
      .isEmpty(),

    check("Mother Mail ID", "Mother Mail ID is required").not().isEmpty(),

    check("Permanent Address", "Permanent Address is required").not().isEmpty(),
    check("Permanent Address Line 1", "Permanent Address Line 1 is required")
      .not()
      .isEmpty(),
    check("Permanent Address Line 2", "Permanent Address Line 2 is required")
      .not()
      .isEmpty(),
    check("Permanent City", "Permanent City is required").not().isEmpty(),
    check("State", "State is required").not().isEmpty(),
    check("Postal Code", "Postal Code is required").not().isEmpty(),
    check("Hostel OR Day Scholar", "Hostel/Dayscholar Field is required")
      .not()
      .isEmpty(),
    check("Is POP2 Training", "POP2 Training Field is required")
      .not()
      .isEmpty(),
    check("Future Skills", "Future Skills Field is required").not().isEmpty(),
  ],

  isSignedIn,
  isAuthenticated,
  updateStudent
);

router.put("/student/dynamicUpdate/:studentId", updateField);

router.get("/dynamicForms/submission/details/:formId/:Batch", findForm);

module.exports = router;
