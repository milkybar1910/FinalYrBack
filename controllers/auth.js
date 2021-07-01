const Student = require("../models/student");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//SIGNUP THE USER/ADMIN
//completed
exports.signup = (req, res) => {
  const errors = validationResult(req);

  //CHECKING ANY ERRORS IN SUBMITTED FORM
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  //CHECKING FOR DUPLICATION
  Student.findOne(
    { "Register Number": req.body["Register Number"] },
    (err, user) => {
      if (err || user) {
        return res.status(406).json({
          error: "Register Number already exists",
        });
      }
      Student.findOne(
        { "Roll Number": req.body["Roll Number"] },
        (err, user) => {
          if (err || user) {
            return res.status(406).json({
              error: "Roll Number already exists",
            });
          }
          Student.findOne(
            { "Primary Email ID": req.body["Primary Email ID"] },
            (err, user) => {
              if (err || user) {
                return res.status(406).json({
                  error: "Email ID already exists",
                });
              }

              //SAVING IN DB OCCURS HERE
              const signup = new Student(req.body);
              signup.save((err, user) => {
                if (err) {
                  return res.status(400).json({
                    error: "NOT able to save user in DB",
                  });
                }

                //SENDING RESPONSE BACK TO FRONTEND
                return res.json({
                  "Register Number": user["Register Number"],
                  RollNumber: user["Roll Number"],
                  "Primary Email ID": user["Primary Email ID"],
                  "Year Of Admission": user["Year Of Admission"],
                  _id: user._id,
                });
              });
            }
          );
        }
      );
    }
  );
};

//SIGNIN THE USER/ADMIN
//completed
exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { password } = req.body;

  //CHECKING FOR ERRORS
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  //FINDING THE USER IN DB
  Student.findOne(
    { "Primary Email ID": req.body["Primary Email ID"] },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User doesn't exists",
        });
      }

      //authenticate method is declared in models => signup
      if (!user.autheticate(password)) {
        return res.status(401).json({
          error: "Email and Password do not match",
        });
      }
      //create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie
      res.cookie("token", token, { expire: new Date() + 9999 });

      //send response to front end

      return res.json({
        token,
        student: {
          _id: user["_id"],
          "Primary EmailID": user["Primary EmailID"],
          role: user.role,
          "Register Number": user["Register Number"],
          "Year Of Admission": user["Year Of Admission"],
        },
      });
    }
  );
};

//LOGOUT THE USER/ADMIN
//completed
exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "User signout successfully",
  });
};

exports.changePassword = (req, res) => {
  const { password } = req.body;
  Student.findOne(
    { "Primary Email ID": req.body["Primary Email ID"] },
    (err, doc) => {
      const securePassword = (plainpassword) => {
        if (!plainpassword) {
          return "passwordNotFound";
        }
        try {
          return crypto
            .createHmac("sha256", doc.salt)
            .update(plainpassword)
            .digest("hex");
        } catch (err) {
          return "";
        }
      };

      const updateData = { encry_password: securePassword(req.body["confirmPassword"]) };

      Student.findOneAndUpdate(
        { "Primary Email ID": req.body["Primary Email ID"] },
        updateData,
        { useFindAndModify: false },
        function (err, doc) {
          if (err) {
            return res.status(422).json({
              error: errors.array()[0].msg,
            });
          }
          return res.json({
            success: "Password updated successfully",
          });
        }
      );
    }
  );
};

//protected routes
//completed
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//custom middlewares
//completed
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

//CHECK ADMIN OR NOT
//completed
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an ADMIN",
    });
  }
  next();
};
