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
  updateProfilePhoto,
  updateCoverPhoto,
  getCoverPhoto,
  getProfilePhoto,
  getUniqueBatch,
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
  "/Student/year/:studentId/:year",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getBatchDetails
);

router.put(
  "/student/update/:studentId",
  isSignedIn,
  isAuthenticated,
  updateStudent
);

router.put("/student/dynamicUpdate/:studentId", updateField);

router.get("/student/coverphoto/:studentId", getCoverPhoto);
router.get("/student/profilephoto/:studentId", getProfilePhoto);

router.put("/student/coverphoto/post/:studentId", updateCoverPhoto);
router.put("/student/profilephoto/post/:studentId", updateProfilePhoto);

router.get("/dynamicForms/submission/details/:formId/:Batch", findForm);

router.get("/uniqueBatch", getUniqueBatch);

module.exports = router;
