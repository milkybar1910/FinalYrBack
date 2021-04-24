const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const JobSchema = new mongoose.Schema({
  "Job Title": {
    type: String,
  },
  "Organization Name": {
    type: String,
  },
  Salary: {
    type: String,
  },
  Location: {
    type: String,
  },
  Batch: {
    type: String,
  },
  "Full Name": {
    type: String,
  },
  "Register Number": {
    type: String,
  },
  "Date Of Joining": {
    type: String,
  },
  "On Campus Or Off Campus": {
    type: String,
  },
  Certificate: {
    data: Buffer,
    contentType: String,
  },
  user: {
    type: ObjectId,
    ref: "Student",
  },
});
module.exports = mongoose.model("Job", JobSchema);
