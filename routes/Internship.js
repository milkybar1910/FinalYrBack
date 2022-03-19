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

router.param("internshipId", getInternshipById);

router.post("/internship/create/:studentId", createInternship);
router.get("/internship/details/info/:userInternFetchId", getInternship);
router.get("/internship/certificate/:internshipId", photo);
router.delete("/internship/delete/:internshipId", deleteInternship);

router.get("/Internship/year/:id/:year", getInternshipinAdmin);

module.exports = router;
