const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const InternshipSchema = new mongoose.Schema({
  "Job Name": {
    type: String,
  },
  "Organization Name": {
    type: String,
  },
  Duration: {
    type: String,
  },
  Location: {
    type: String,
  },
  Batch: {
    type: String,
  },
  "Register Number": {
    type: String,
  },
  Certificate: {
    data: Buffer,
    contentType: String,
  },
  From: {
    type: String,
  },
  To: {
    type: String,
  },
  "Full Name": {
    type: String,
  },

  user: {
    type: ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Internship", InternshipSchema);
