const Workshop = require("../models/Workshop");
const formidable = require("formidable");
const fs = require("fs");
const JSZip = require("jszip");
var zip = new JSZip();
const csvjson = require("csvjson");

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

exports.createWorkshop = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        error: "problem with image",
      });
    }

    let workshop = new Workshop(fields);

    workshop.Certificate.data = fs.readFileSync(file.Certificate.path);
    workshop.Certificate.contentType = file.Certificate.type;

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

exports.getWorkshop = (req, res) => {
  const { userWorkshopFetchId } = req.params;
  Workshop.find({ user: userWorkshopFetchId })
    .select("-__v -Certificate -user")
    .exec((err, workshop) => {
      return res.send(workshop);
    });
};
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
          headers: "key",
        });

        zip.file("Workshop.csv", csvData);
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
