const express = require("express");
const router = express.Router();

const {
  getWorkshopById,
  createWorkshop,
  getWorkshop,
  photo,
  deleteWorkshop,
  getWorkshopinAdmin,
} = require("../controllers/Workshop");

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getStudentById } = require("../controllers/student");

// all of params
router.param("studentId", getStudentById);
router.param("workshopId", getWorkshopById);

//create route
router.post(
  "/workshop/create/:studentId",
  isSignedIn,
  isAuthenticated,
  createWorkshop
);

//read route
router.get("/workshop/details/info/:userWorkshopFetchId", getWorkshop);
router.get("/workshop/certificate/:workshopId", photo);

router.get("/workshop/year/:id/:year", getWorkshopinAdmin); //completed

//delete route
router.delete("/workshop/delete/:workshopId", deleteWorkshop);

module.exports = router;
