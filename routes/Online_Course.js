const express = require("express");
const router = express.Router();

const {
  getCourseById,
  createCourse,
  getCourse,
  photo,
  deleteCourse,
  getCourseinAdmin,
} = require("../controllers/Online_Course");

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getStudentById } = require("../controllers/student");

// all of params
router.param("studentId", getStudentById);
router.param("courseId", getCourseById);

//create route
router.post(
  "/course/create/:studentId",
  isSignedIn,
  isAuthenticated,
  createCourse
);

//read route
router.get("/course/details/info/:userCourseFetchId", getCourse);
router.get("/course/certificate/:courseId", photo);

router.get("/course/year/:id/:year", getCourseinAdmin);

//delete route
router.delete("/course/delete/:courseId", deleteCourse);

module.exports = router;
