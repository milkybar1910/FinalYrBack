const DynamicForm = require("../models/DynamicForm");

const Student = require("../models/student");

exports.createFormField = (req, res) => {
  let DynamicForms = new DynamicForm(req.body);

  DynamicForms.save((err, request) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save user in Database",
      });
    }

    return res.json({ message: "SUCESSFULLY POSTED" });
  });
};

exports.getDynamicForms = (req, res) => {
  const { year } = req.params;
  DynamicForm.find({ Batch: year }).exec(function (err, result) {
    if (err) throw err;
    return res.json({
      result,
    });
  });
};

exports.getFormsName = (req, res) => {
  DynamicForm.find().exec(function (err, result) {
    if (err) throw err;
    return res.json({
      result,
    });
  });
};

exports.deleteForms = (req, res) => {
  const { year, formId } = req.params;
  Student.updateMany(
    {
      "Year Of Admission": year,
    },
    {
      $pull: { properties: { _id: formId } },
    },
    { upsert: false, multi: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "ERROR TRY AGAIN LATER",
      });
    }
    DynamicForm.deleteOne({ _id: formId }).exec((err, deletedMessage) => {
      if (err) {
        return res.status(400).json({
          error: "ERROR TRY AGAIN LATER",
        });
      }
      return res.json({
        message: "SUCCESSFULLY DELETED",
      });
    });
  });
};
