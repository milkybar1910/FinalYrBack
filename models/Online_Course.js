const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CourseSchema = new mongoose.Schema({
  "Course Name": {
    type: String,
  },
  "Platform Name": {
    type: String,
  },
  Duration: {
    type: String,
  },
  From: {
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
  To: {
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

module.exports = mongoose.model("Course", CourseSchema);
