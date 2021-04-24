const express = require("express");
const router = express.Router();
const {
  createFormField,
  getDynamicForms,
  getFormsName,
  deleteForms,
} = require("../controllers/DynamicForm");
const { getStudentById } = require("../controllers/student");

router.param("adminId", getStudentById);

router.post("/dynamicform/create/:adminId", createFormField);

router.get("/notifications/details/:year", getDynamicForms);
router.get("/formnames/details/", getFormsName);

router.put("/form/:formId/:year", deleteForms);

module.exports = router;
