const Student = require("../models/student");
const { validationResult } = require("express-validator");

//completed
exports.getStudentById = (req, res, next, id) => {
  Student.findById(id).exec((err, student) => {
    if (err || !student) {
      return res.status(400).json({
        error: "no student was found in DB",
      });
    }
    req.profile = student;

    next();
  });
};

//completed
exports.getStudent = (req, res) => {
  return res.json(req.profile);
};

//completed
exports.updateStudent = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  if (req.body["Primary Email ID"] === req.body["Alternate Email ID"]) {
    return res.status(422).json({
      error: "Primary and Alternate Email Id should be different",
    });
  }
  if (req.body["Primary Number"] === req.body["Emergency Number"]) {
    return res.status(422).json({
      error: "Primary and Emergency Number should be different",
    });
  }

  const id = req.profile._id;
  Student.findByIdAndUpdate(
    id,
    req.body,
    { upsert: true, useFindAndModify: false },
    function (err, doc) {
      if (err) return res.status(500).json({ error: "ERROR IN UPDATION" });
      return res.json({
        message: "Updated Successfully",
      });
    }
  );
};

//completed
exports.getBatchDetails = (req, res) => {
  const { year } = req.params;
  Student.find({ "Year Of Admission": year })
    .select(
      "-_id -role -salt -encry_password -updatedAt -__v -createdAt -properties"
    )
    .exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "no student was found in DB",
        });
      }
      return res.json(student);
    });
};

//completed
exports.updateField = (req, res) => {
  const { student_id } = req.body;

  req.body["Register Number"] = req.profile["Register Number"];
  req.body["Interested"] = "YES";

  Student.updateOne(
    { _id: student_id },
    { $push: { properties: req.body } },
    { upsert: true, useFindAndModify: false, new: true },
    function (err, doc) {
      if (err) return res.status(500).json({ error: "ERROR IN UPDATION" });

      return res.json({
        message: "Updated Successfully",
      });
    }
  );
};

//todo:come here
exports.findForm = (req, res) => {
  const { formId, Batch } = req.params;
  Student.find({
    "Year Of Admission": Batch,
  })
    .select(" -_id")
    .exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "no student was found in DB",
        });
      }
      let result = [];
      for (let i = 0; i < student.length; i++) {
        let propertiesOfStudent = [];
        for (let j = 0; j < student[i].properties.length; j++) {
          if (student[i].properties[j]["_id"] === formId) {
            propertiesOfStudent.push(student[i].properties[j]);
            result.push(student[i].properties[j]);
          }
        }
        if (propertiesOfStudent.length === 0) {
          result.push({
            Interested: "NO",
            "Register Number": student[i]["Register Number"],
          });
        }
      }

      return res.json(result);
    });
};

//completed
exports.getStudentForNotification = (req, res) => {
  let result = req.profile.properties.map((data) => data._id);
  return res.json(result);
};
