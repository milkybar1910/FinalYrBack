const Course = require("../models/Online_Course");
const formidable = require("formidable");
const fs = require("fs");

exports.getCourseById = (req, res, next, id) => {
  Course.findById(id).exec((err, course) => {
    if (err) {
      return res.status(400).json({
        error: "Course not found",
      });
    }
    req.course = course;
    next();
  });
};

//completed
exports.createCourse = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with certificate",
      });
    }
    //DESTRUCTING
    const { Duration, From, To } = fields;

    //ADDED FOR USING IN ADMIN SIDE
    fields.Batch = req.profile["Year Of Admission"];
    fields["Register Number"] = req.profile["Register Number"];
    fields["Full Name"] = req.profile["Full Name"];

    if (!fields["Course Name"]) {
      return res.status(400).json({
        error: "Course Name is required",
      });
    }
    if (!fields["Platform Name"]) {
      return res.status(400).json({
        error: "Platform Name is required",
      });
    }
    if (!Duration) {
      return res.status(400).json({
        error: "Duration is required",
      });
    }
    if (!From) {
      return res.status(400).json({
        error: "From Date is required",
      });
    }
    if (From) {
      let pattern = /^\d{2}['/']{1}\d{2}['/']{1}\d{4}/;

      if (!From.match(pattern)) {
        return res.status(400).json({
          error: "From Date Format is invalid",
        });
      }
    }

    if (!To) {
      return res.status(400).json({
        error: "To Date is required",
      });
    }
    if (To) {
      let pattern = /^\d{2}['/']{1}\d{2}['/']{1}\d{4}/;

      if (!To.match(pattern)) {
        return res.status(400).json({
          error: "To Date Format is invalid",
        });
      }
    }

    let course = new Course(fields);

    //handle file here
    if (file.Certificate) {
      if (file.Certificate.size > 2713907) {
        return res.status(400).json({
          error: "Certicate size too big!",
        });
      }
      if (
        file.Certificate.type === "image/png" ||
        file.Certificate.type === "image/jpg" ||
        file.Certificate.type === "image/jpeg"
      ) {
        course.Certificate.data = fs.readFileSync(file.Certificate.path);
        course.Certificate.contentType = file.Certificate.type;
      } else {
        return res.status(400).json({
          error: "CERTIFICATE FORMAT SHOULD BE PNG/JPG/JPEG",
        });
      }
    } else {
      return res.status(400).json({
        error: "Certificate is missing",
      });
    }

    //save to the DB
    course.save((err, course) => {
      if (err) {
        return res.status(400).json({
          error: "Saving course in DB failed",
        });
      }
      return res.json({
        message: "SUCCESSFULLY UPLOADED",
      });
    });
  });
};

//completed
exports.getCourse = (req, res) => {
  const { userCourseFetchId } = req.params;
  Course.find({ user: userCourseFetchId })
    .select("-user -__v -Certificate")
    .exec((err, course) => {
      if (err) {
        return res.status(400).json({
          error: "COURSE CERTIFICATE NOT FOUND",
        });
      }
      if (!course) {
        return res.status(400).json({
          message: "COURSE CERTIFICATE NOT ADDED",
        });
      }

      return res.send(course);
    });
};

//middleware
//completed
exports.photo = (req, res, next) => {
  if (req.course.Certificate !== null) {
    if (req.course.Certificate.data) {
      res.set("Content-Type", req.course.Certificate.contentType);
      return res.send(req.course.Certificate.data);
    }
  }
  next();
};

//completed
// exports.getCourseinAdmin = (req, res) => {
//   const { year } = req.params;
//   Course.find({ Batch: year })
//     .select("-_id -__v -user")
//     .exec((err, student) => {
//       if (err || !student) {
//         return res.status(400).json({
//           error: "No student was found in DB",
//         });
//       }
//       return res.send(student);
//     });
// };

//completed
exports.deleteCourse = (req, res) => {
  let course = req.course;
  course.remove((err, deletedCourse) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete course",
      });
    }
    return res.json({
      message: "Delete was a success",
      deletedCourse,
    });
  });
};

// TODO:
exports.getCourseinAdmin = (req, res) => {
  const { year } = req.params;
  Course.find({ Batch: year })
    .select("-_id -__v -user")
    .exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "No student was found in DB",
        });
      }
      student.map((data, index) =>
       {
        zip.file(
          `${data["Register Number"]}(${index}).png`,
          data.Certificate?.data.buffer,
          {
            base64: true,
          }
        )
       }
      );

      zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
        res.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-disposition": `attachment; filename=user_report.zip`,
        });
        res.end(content);
      });
    });
};