const mongoose = require("mongoose");

const DynamicFormSchema = new mongoose.Schema(
  {
    "Form Name": {
      type: String,
    },
    Batch: {
      type: String,
    },
    Fields: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DynamicForm", DynamicFormSchema);
