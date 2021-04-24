const express = require("express");
const { ToggleChange, ToggleDetails } = require("../controllers/Toggle");
const router = express.Router();

router.post("/toggle", ToggleChange);

router.get("/toggleInfo", ToggleDetails);

module.exports = router;
