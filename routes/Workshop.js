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

router.param("workshopId", getWorkshopById);

router.post("/workshop/create/:studentId", createWorkshop);
router.get("/Workshop/details/info/:userWorkshopFetchId", getWorkshop);
router.get("/workshop/certificate/:workshopId", photo);
router.delete("/workshop/delete/:workshopId", deleteWorkshop);

router.get("/workshop/year/:id/:year", getWorkshopinAdmin);

module.exports = router;
