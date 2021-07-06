const Workshop = require("../models/Workshop");
const formidable = require("formidable");
const fs = require("fs");
const { validationResult } = require("express-validator");
const JSZip = require("jszip");
var zip = new JSZip();

const csvjson  = require("csvjson");
exports.getWorkshopById = (req, res, next, id) => {
  Workshop.findById(id).exec((err, workshop) => {
    if (err) {
      return res.status(400).json({
        error: "Workshop not found",
      });
    }
    req.workshop = workshop;
    next();
  });
};

//completed
exports.createWorkshop = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        error: "problem with image",
      });
    }
    //DESTRUCTING
    const { Duration } = fields;

    //ADDED FOR USING IN ADMIN SIDE
    fields.Batch = req.profile["Year Of Admission"];
    fields["Register Number"] = req.profile["Register Number"];
    fields["Full Name"] = req.profile["Full Name"];

    if (!fields["Course Name"]) {
      return res.status(400).json({
        error: "Course Name is required",
      });
    }
    if (!fields["Organization Name"]) {
      return res.status(400).json({
        error: "Organisation Name is required",
      });
    }
    if (!Duration) {
      return res.status(400).json({
        error: "Duration is required",
      });
    }
    if (!fields["From Date"]) {
      return res.status(400).json({
        error: "Date is required",
      });
    }
    if (!fields["To Date"]) {
      return res.status(400).json({
        error: "Date is required",
      });
    }

    if (fields["From Date"]) {
      let pattern = /^\d{2}['/']{1}\d{2}['/']{1}\d{4}/;

      if (!fields["From Date"].match(pattern)) {
        return res.status(400).json({
          error: "Date Format is invalid",
        });
      }
    }
    if (fields["To Date"]) {
      let pattern = /^\d{2}['/']{1}\d{2}['/']{1}\d{4}/;

      if (!fields["To Date"].match(pattern)) {
        return res.status(400).json({
          error: "Date Format is invalid",
        });
      }
    }

    let workshop = new Workshop(fields);

    //handle file here
    if (file.Certificate) {
      if (file.Certificate.size > 2713907) {
        return res.status(400).json({
          error: "Certificate size too big!",
        });
      }
      if (
        file.Certificate.type === "image/png" ||
        file.Certificate.type === "image/jpg" ||
        file.Certificate.type === "image/jpeg"
      ) {
        workshop.Certificate.data = fs.readFileSync(file.Certificate.path);
        workshop.Certificate.contentType = file.Certificate.type;
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
    workshop.save((err, workshop) => {
      if (err) {
        return res.status(400).json({
          error: "Saving workshop in DB failed",
        });
      }
      res.json({
        message: "SUCCESSFULLY UPLOADED",
      });
    });
  });
};

//completed
exports.getWorkshop = (req, res) => {
  const { userWorkshopFetchId } = req.params;
  Workshop.find({ user: userWorkshopFetchId })
    .select("-__v -Certificate -user")
    .exec((err, workshop) => {
      if (err) {
        return res.status(400).json({
          error: "WORKSHOP CERTIFICATE NOT FOUND",
        });
      }
      if (!workshop) {
        return res.status(400).json({
          message: "WORKSHOP CERTIFICATE NOT ADDED",
        });
      }

      return res.send(workshop);
    });
};

//completed
// exports.getWorkshopinAdmin = (req, res) => {
//   const { year } = req.params;
//   Workshop.find({ Batch: year })
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

//middleware
//completed
exports.photo = (req, res, next) => {
  if (req.workshop.Certificate !== null) {
    if (req.workshop.Certificate.data) {
      res.set("Content-Type", req.workshop.Certificate.contentType);
      return res.send(req.workshop.Certificate.data);
    }
  }
  next();
};

//completed
exports.deleteWorkshop = (req, res) => {
  let workshop = req.workshop;
  workshop.remove((err, deletedWorkshop) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete workshop",
      });
    }
    return res.json({
      message: "Delete was a success",
      deletedWorkshop,
    });
  });
};


//todo:check for the errors
exports.getWorkshopinAdmin = (req, res) => {
  const { year } = req.params;
  Workshop.find({ Batch: year })
    .select("-_id -__v -user -Certificate")
    .exec((err, workshop) => {
      if (err || !workshop) {
        return res.status(400).json({
          error: "No student was found in DB",
        });
      }
      if (workshop.length > 0) {
          // Convert json to csv function
          const csvData = csvjson.toCSV(JSON.stringify(workshop), {
              headers: 'key'
          });
        
          zip.file("Workshop.csv",csvData);
          Workshop.find({ Batch: year })
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
                res.set( {
                  "Content-Type": "application/zip",
                });
               return  res.end(
                  content
                );
              });
          });
      }
      else{

        return res.json({
          "err":"SDFAsd"
        });
      }
    });
};