const Toggle = require("../models/Toggle");

//completed
exports.ToggleChange = (req, res) => {
  Toggle.findOne({ key: "123456" }, (err, user) => {
    if (user) {
      Toggle.updateOne({ key: "123456" }, req.body, (err, toggleChange) => {
        if (err) {
          return res.status(400).json({
            error: "Not able to update ",
          });
        }
        return res.json({
          message: "Updated Successfully ",
        });
      });
    } else {
      const toggle = new Toggle(req.body);

      toggle.save((err, toggleChange) => {
        if (err) {
          return res.status(400).json({
            error: "Not able to update",
          });
        }
        return res.json({
          message: "Updated Successfully",
        });
      });
    }
  });
};

//completed
exports.ToggleDetails = (req, res) => {
  Toggle.findOne({ key: "123456" }, (err, user) => {
    if (!user) {
      return res.json({
        intern: false,
        profile: false,
        workshop: false,
        joboffer: false,
        course: false,
      });
    } else {
      return res.json(user);
    }
  });
};
