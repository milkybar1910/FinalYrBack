const Internship = require("../models/Internship");
const formidable = require("formidable");
const fs = require("fs");
const JSZip = require("jszip");
var zip = new JSZip();

const csvjson  = require("csvjson");
//completed
exports.getInternshipById = (req, res, next, id) => {
  Internship.findById(id).exec((err, internship) => {
    if (err) {
      return res.status(400).json({
        error: "Internship not found",
      });
    }
    req.internship = internship;
    next();
  });
};

//completed
exports.createInternship = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with certificate",
      });
    }
    //DESTRUCTING
    const { Duration, Location, From, To } = fields;

    //ADDED FOR USING IN ADMIN SIDE
    fields.Batch = req.profile["Year Of Admission"];
    fields["Register Number"] = req.profile["Register Number"];
    fields["Full Name"] = req.profile["Full Name"];

    if (!fields["Job Name"]) {
      return res.status(400).json({
        error: "Job Name is required",
      });
    }
    if (!fields["Organization Name"]) {
      return res.status(400).json({
        error: "Organization Name is required",
      });
    }
    if (!Duration) {
      return res.status(400).json({
        error: "Duration is required",
      });
    }
    if (!Location) {
      return res.status(400).json({
        error: "Location is required",
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

    let internship = new Internship(fields);

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
        internship.Certificate.data = fs.readFileSync(file.Certificate.path);
        internship.Certificate.contentType = file.Certificate.type;
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
    internship.save((err, internship) => {
      if (err) {
        return res.status(400).json({
          error: "Saving Internship in DB failed",
        });
      }
      return res.json({
        message: "SUCCESSFULLY UPLOADED",
      });
    });
  });
};

//completed
exports.getInternship = (req, res) => {
  const { userInternFetchId } = req.params;
  Internship.find({ user: userInternFetchId })
    .select("-Certificate -__v -user")
    .exec((err, internship) => {
      if (err) {
        return res.status(400).json({
          error: "INTERNSHIP CERTIFICATE NOT FOUND",
        });
      }
      if (!internship) {
        return res.status(400).json({
          message: "INTERNSHIP CERTIFICATE NOT ADDED",
        });
      }

      return res.send(internship);
    });
};

//for getting internship
//completed
exports.getInternshipinAdmin = (req, res) => {
  const { year } = req.params;
  Internship.find({ Batch: year })
    .select("-_id -__v -user")
    .exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "no student was found in DB",
        });
      }
      return res.send(student);
    });
};

//middleware
//completed
exports.photo = (req, res, next) => {
  if (req.internship.Certificate !== null) {
    if (req.internship.Certificate.data) {
      res.set("Content-Type", req.internship.Certificate.contentType);
      return res.send(req.internship.Certificate.data);
    }
  }
  next();
};

//completed
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
              headers: 'key'
          });
        
          zip.file("Internship.csv",csvData);
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
