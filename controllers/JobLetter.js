const Job = require("../models/JobLetter");
const formidable = require("formidable");
const fs = require("fs");

exports.getJobLetterById = (req, res, next, id) => {
  Job.findById({ _id: id }).exec((err, job) => {
    if (err) {
      return res.status(400).json({
        error: "Job Letter not found",
      });
    }
    req.job = job;
    next();
  });
};

//completed
exports.createJobLetter = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with pdf",
      });
    }

    //ADDED FOR USING IN ADMIN SIDE
    fields.Batch = req.profile["Year Of Admission"];
    fields["Register Number"] = req.profile["Register Number"];
    fields["Full Name"] = req.profile["Full Name"];

    if (!fields["Job Title"]) {
      return res.status(400).json({
        error: "Job Title is required",
      });
    }
    if (!fields["Organization Name"]) {
      return res.status(400).json({
        error: "Organization Name is required",
      });
    }

    if (!fields["Salary"]) {
      return res.status(400).json({
        error: "Salary is required",
      });
    }

    if (fields["Salary"]) {
      let pattern = /^[0-9]+.[0-9]+$/;
      let pattern1 = /^[0-9]+$/;
      if (
        !fields["Salary"].match(pattern) &&
        !fields["Salary"].match(pattern1)
      ) {
        return res.status(400).json({
          error: "Invalid Salary Format",
        });
      }
    }

    if (!fields["Date Of Joining"]) {
      return res.status(400).json({
        error: "Date of Joining required",
      });
    }

    if (fields["Date Of Joining"]) {
      let pattern = /^\d{2}['/']{1}\d{2}['/']{1}\d{4}/;

      if (!fields["Date Of Joining"].match(pattern)) {
        return res.status(400).json({
          error: "Date Of Joining Format is invalid",
        });
      }
    }

    if (!fields["On Campus Or Off Campus"]) {
      return res.status(400).json({
        error: "Whether on or off campus!",
      });
    }
    if (!file.Certificate) {
      return res.status(400).json({
        error: "Certificate is missing",
      });
    }

    let job = new Job(fields);

    //handle file here
    if (file.Certificate) {
      if (file.Certificate > 3000000000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }

      job.Certificate.data = fs.readFileSync(file.Certificate.path);

      job.Certificate.contentType = file.Certificate.type;
    }

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
      if (err) {
        return res.status(400).json({
          error: "JOB LETTER NOT FOUND",
        });
      }
      if (!job) {
        return res.status(400).json({
          message: "JOB LETTER NOT ADDED",
        });
      }
      return res.send(job);
    });
};

//completed
exports.getJobinAdmin = (req, res) => {
  const { year } = req.params;
  Job.find({ Batch: year })
    .select("-_id -user -__v ")
    .exec((err, jobResult) => {
      if (err || !jobResult) {
        return res.status(400).json({
          error: "no student was found in DB",
        });
      }
      return res.json(jobResult);
    });
};

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
