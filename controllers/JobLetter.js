const Job = require("../models/JobLetter");
const formidable = require("formidable");
const fs = require("fs");
const JobLetter = require("../models/JobLetter");
const JSZip = require("jszip");
var zip = new JSZip();
const csvjson = require("csvjson");

exports.getJobLetterById = (req, res, next, id) => {
  Job.findById({ _id: id }).exec((err, job) => {
    req.job = job;
    next();
  });
};

exports.createJobLetter = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with pdf",
      });
    }
    let job = new Job(fields);
    job.Certificate.data = fs.readFileSync(file.Certificate.path);
    job.Certificate.contentType = file.Certificate.type;

    //save to the DB
    job.save((err, job) => {
      if (err) {
        return res.status(400).json({
          error: "Saving Job  in DB failed",
        });
      }
      return res.json({
        message: "SUCCESSFULLY UPLOADED",
      });
    });
  });
};

//completed
exports.getJob = (req, res) => {
  const { userJobFetchId } = req.params;
  Job.find({ user: userJobFetchId })
    .select("-__v -user -Certificate")
    .exec((err, job) => {
      return res.send(job);
    });
};

// //completed
// exports.getJobinAdmin = (req, res) => {
//   const { year } = req.params;
//   Job.find({ Batch: year })
//     .select("-_id -user -__v ")
//     .exec((err, jobResult) => {
//       if (err || !jobResult) {
//         return res.status(400).json({
//           error: "no student was found in DB",
//         });
//       }
//       return res.json(jobResult);
//     });
// };

//completed
exports.pdf = (req, res, next) => {
  if (req.job.Certificate !== null) {
    if (req.job.Certificate.data) {
      res.set("Content-Type", req.job.Certificate.contentType);
      return res.send(req.job.Certificate.data);
    }
  }
  next();
};

//completed
exports.deleteJob = (req, res) => {
  let job = req.job;
  job.remove((err, deletedJob) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete",
      });
    }
    return res.json({
      message: "Delete was a success",
      deletedJob,
    });
  });
};

//todo:check for the errors
exports.getJobinAdmin = (req, res) => {
  const { year } = req.params;
  JobLetter.find({ Batch: year })
    .select("-_id -__v -user -Certificate")
    .exec((err, joboffer) => {
      if (err || !joboffer) {
        return res.status(400).json({
          error: "No student was found in DB",
        });
      }
      if (joboffer.length > 0) {
        // Convert json to csv function
        const csvData = csvjson.toCSV(JSON.stringify(joboffer), {
          headers: "key",
        });

        zip.file("JobLetter.csv", csvData);
        JobLetter.find({ Batch: year })
          .select(["Register Number", "Certificate"])
          .exec((err, dataBlog) => {
            if (err || !dataBlog) {
              return res.status(400).json({
                error: "No certificate was found in DB",
              });
            }
            dataBlog.map((data, index) => {
              zip.file(
                `${data["Register Number"]}(${index}).pdf`,
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
