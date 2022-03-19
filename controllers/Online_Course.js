const Course = require("../models/Online_Course");
const formidable = require("formidable");
const fs = require("fs");
const JSZip = require("jszip");
var zip = new JSZip();
const csvjson = require("csvjson");

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

exports.createCourse = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with certificate",
      });
    }
    let course = new Course(fields);
    course.Certificate.data = fs.readFileSync(file.Certificate.path);
    course.Certificate.contentType = file.Certificate.type;

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

exports.getCourse = (req, res) => {
  const { userCourseFetchId } = req.params;
  Course.find({ user: userCourseFetchId })
    .select("-user -__v -Certificate")
    .exec((err, course) => {
      return res.send(course);
    });
};

exports.photo = (req, res, next) => {
  if (req.course.Certificate !== null) {
    if (req.course.Certificate.data) {
      res.set("Content-Type", req.course.Certificate.contentType);
      return res.send(req.course.Certificate.data);
    }
  }
  next();
};

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

//todo:check for the errors
exports.getCourseinAdmin = (req, res) => {
  const { year } = req.params;
  Course.find({ Batch: year })
    .select("-_id -__v -user -Certificate")
    .exec((err, course) => {
      if (err || !course) {
        return res.status(400).json({
          error: "No student was found in DB",
        });
      }
      if (course.length > 0) {
        // Convert json to csv function
        const csvData = csvjson.toCSV(JSON.stringify(course), {
          headers: "key",
        });

        zip.file("OnlineCourse.csv", csvData);
        Course.find({ Batch: year })
          .select(["Register Number", "Certificate"])
          .exec((err, dataBlog) => {
            if (err || !dataBlog) {
              return res.status(400).json({
                error: "No certificate was found in DB",
              });
            }
            dataBlog.map((data, index) => {
              zip.file(
                `${data["Register Number"]}(${index}).png`,
                data.Certificate?.data.buffer,
                {
                  compression: "DEFLATE",
                  compressionOptions: {
                    level: 9, // force a compression and a compression level for this file
                  },
                  base64: true,
                }
              );
            });

            zip
              .generateAsync({
                type: "nodebuffer",
                compression: "DEFLATE",
                compressionOptions: {
                  level: 9,
                },
              })
              .then(function (content) {
                res.set({
                  "Content-Type": "application/zip",
                });
                return res.end(content);
              });
          });
      } else {
        return res.json({
          err: "SDFAsd",
        });
      }
    });
};
