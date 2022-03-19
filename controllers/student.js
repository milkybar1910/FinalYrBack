const Student = require("../models/student");
const formidable = require("formidable");
const fs = require("fs");
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

exports.getStudent = (req, res) => {
  return res.json(req.profile);
};

exports.updateStudent = (req, res) => {
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
      "-_id -role -salt -encry_password -updatedAt -__v -createdAt -properties -CoverPhoto -ProfilePhoto"
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
  const { studentId } = req.params;

  req.body["Register Number"] = req.profile["Register Number"];
  req.body["Interested"] = "YES";

  Student.updateOne(
    { _id: studentId },
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

exports.getProfilePhoto = (req, res, next) => {
  if (req.profile.ProfilePhoto !== null) {
    if (req.profile.ProfilePhoto.data) {
      res.set("Content-Type", req.profile.ProfilePhoto.contentType);
      return res.send(req.profile.ProfilePhoto.data);
    } else {
      return res.json({
        error: "no data",
      });
    }
  }
  next();
};

exports.getCoverPhoto = (req, res, next) => {
  if (req.profile.CoverPhoto !== null) {
    if (req.profile.CoverPhoto.data) {
      res.set("Content-Type", req.profile.CoverPhoto.contentType);
      return res.send(req.profile.CoverPhoto.data);
    } else {
      return res.json({
        error: "no data",
      });
    }
  }
  next();
};

exports.updateProfilePhoto = (req, res) => {
  const id = req.profile._id;

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: { Picture: "Problem with picture" },
      });
    }

    const data = {
      ProfilePhoto: {
        data: "",
        contentType: "s",
      },
    };
    //handle file here

    data.ProfilePhoto.data = fs.readFileSync(file.ProfilePhoto.path);
    data.ProfilePhoto.contentType = file.ProfilePhoto.type;

    Student.findByIdAndUpdate(
      id,
      data,
      { upsert: true, useFindAndModify: false },
      function (err, doc) {
        if (err) return res.status(500).json({ error: "ERROR IN UPDATION" });

        return res.json({
          message: "Updated Successfully",
        });
      }
    );
  });
};
exports.updateCoverPhoto = (req, res) => {
  const id = req.profile._id;

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: { Picture: "Problem with picture" },
      });
    }

    const data = {
      CoverPhoto: {
        data: "",
        contentType: "",
      },
    };
    //handle file here

    data.CoverPhoto.data = fs.readFileSync(file.CoverPhoto.path);
    data.CoverPhoto.contentType = file.CoverPhoto.type;

    Student.findByIdAndUpdate(
      id,
      data,
      { upsert: true, useFindAndModify: false },
      function (err, doc) {
        if (err) return res.status(500).json({ error: "ERROR IN UPDATION" });

        return res.json({
          message: "Updated Successfully",
        });
      }
    );
  });
};

exports.getUniqueBatch = (req, res) => {
  Student.find().distinct(
    "Year Of Admission",
    { "Year Of Admission": { $gt: 2017 } },
    function (error, batch) {
      // ids is an array of all ObjectIds

      return res.json({
        batch,
      });
    }
  );
};
