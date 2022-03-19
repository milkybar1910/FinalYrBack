const mongoose = require("mongoose");

const ToggleSchema = new mongoose.Schema({
  internship: {
    type: Boolean,
    default: false,
  },
  workshop: {
    type: Boolean,
    default: false,
  },
  joboffer: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: Boolean,
    default: false,
  },
  key: {
    type: String,
    default: "123456",
  },
});
module.exports = mongoose.model("Toggle", ToggleSchema);
