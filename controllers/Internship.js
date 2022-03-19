const Internship = require("../models/Internship");
const formidable = require("formidable");
const fs = require("fs");
const JSZip = require("jszip");
var zip = new JSZip();
const csvjson = require("csvjson");

exports.getInternshipById = (req, res, next, id) => {
  Internship.findById(id).exec((err, internship) => {
    req.internship = internship;
    next();
  });
};

exports.createInternship = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: { Certificate: "Problem with certificate" },
      });
    }
    let internship = new Internship(fields);
    //handle file here
    internship.Certificate.data = fs.readFileSync(file.Certificate.path);
    internship.Certificate.contentType = file.Certificate.type;

    internship.save((err, internship) => {
      if (err) {
        return res.status(400).json({
          error: { Certificate: "Saving Internship in DB failed" },
        });
      }
      return res.json({
        message: "SUCCESSFULLY UPLOADED",
      });
    });
  });
};

exports.getInternship = (req, res) => {
  const { userInternFetchId } = req.params;
  Internship.find({ user: userInternFetchId })
    .select("-Certificate -__v -user")
    .exec((err, internship) => {
      return res.send(internship);
    });
};

exports.getInternshipinAdmin = (req, res) => {
  const { year } = req.params;
  Internship.find({ Batch: year })
    .select("-_id -__v -user")
    .exec((err, student) => {
      return res.send(student);
    });
};

exports.photo = (req, res, next) => {
  if (req.internship.Certificate !== null) {
    if (req.internship.Certificate.data) {
      res.set("Content-Type", req.internship.Certificate.contentType);
      return res.send(req.internship.Certificate.data);
    }
  }
  next();
};

exports.deleteInternship = (req, res) => {
  let internship = req.internship;
  internship.remove((err, deletedInternship) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete internship",
      });
    }
    return res.json({
      message: "Delete was a success",
      deletedInternship,
    });
  });
};

//todo:check for the errors
exports.getInternshipinAdmin = (req, res) => {
  const { year } = req.params;
  Internship.find({ Batch: year })
    .select("-_id -__v -user -Certificate")
    .exec((err, internship) => {
      if (err || !internship) {
        return res.status(400).json({
          error: "No student was found in DB",
        });
      }
      if (internship.length > 0) {
        // Convert json to csv function
        const csvData = csvjson.toCSV(JSON.stringify(internship), {
          headers: "key",
        });

        zip.file("Internship.csv", csvData);
        Internship.find({ Batch: year })
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
