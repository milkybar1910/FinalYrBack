const express = require("express");
const router = express.Router();

const {
  getJob,
  createJobLetter,
  getJobLetterById,
  getJobinAdmin,
  deleteJob,
  pdf,
} = require("../controllers/JobLetter");

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getStudentById } = require("../controllers/student");

// all of params
router.param("studentId", getStudentById); //completed
router.param("jobId", getJobLetterById); //completed

//create route
router.post(
  "/job/create/:studentId",
  isSignedIn,
  isAuthenticated,
  createJobLetter
); //COMPLETED

//read route
router.get("/job/details/info/:userJobFetchId", getJob); //completed
router.get("/job/certificate/:jobId", pdf); //completed

router.get("/joboffer/year/:id/:year", getJobinAdmin); //COMPLETED

// delete route
router.delete("/job/delete/:jobId", deleteJob); //completed

module.exports = router;
