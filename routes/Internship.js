const express = require("express");
const router = express.Router();

const {
  getInternshipById,
  createInternship,
  getInternship,
  photo,
  deleteInternship,
  getInternshipinAdmin,
} = require("../controllers/Internship");

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getStudentById } = require("../controllers/student");

// all of params
router.param("studentId", getStudentById);
router.param("internshipId", getInternshipById);

//create route //route in studentView -> intership.js
router.post(
  "/internship/create/:studentId",
  isSignedIn,
  isAuthenticated,
  createInternship
);

//read route
//route in studenview->studentHome.js
router.get("/internship/details/info/:userInternFetchId", getInternship);
router.get("/internship/certificate/:internshipId", photo);

//route in adminView->Batch.js
router.get("/internship/year/:id/:year", getInternshipinAdmin);

// delete route
//route in studenview->studentHome.js

router.delete("/internship/delete/:internshipId", deleteInternship);

module.exports = router;
