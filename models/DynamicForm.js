const mongoose = require("mongoose");

const DynamicFormSchema = new mongoose.Schema({
  FormName: {
    type: String,
  },
  Description: {
    type: String,
  },
  Batch: {
    type: String,
  },
  Values: {},
});

module.exports = mongoose.model("DynamicForm", DynamicFormSchema);
