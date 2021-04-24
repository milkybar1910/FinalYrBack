const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const WorkshopSchema = new mongoose.Schema({
  "Course Name": {
    type: String,
  },
  "Organization Name": {
    type: String,
  },
  Duration: {
    type: String,
  },
  Batch: {
    type: String,
  },
  "Register Number": {
    type: String,
  },
  "Full Name": {
    type: String,
  },
  Date: {
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

module.exports = mongoose.model("Workshop", WorkshopSchema);
