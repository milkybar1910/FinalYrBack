const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const studentSchema = new mongoose.Schema(
  {
    "Register Number": {
      type: String,
      required: true,
    },

    "Roll Number": {
      type: String,
      required: true,
    },

    Title: {
      type: String, //Mr.|| Mrs
    },
    "Full Name": {
      type: String,
    },
    "First Name": {
      type: String,
    },

    "Last Name": {
      type: String,
    },
    Gender: {
      type: String,
    },
    "DOB I": { type: String },
    "DOB II": { type: String },
    "DOB III": { type: String },
    College: {
      type: String,
      default: "St Joseph's Institute Of Technology",
    },
    Degree: {
      type: String,
      default: "Bachelor Of Technology",
    },
    Branch: {
      type: String,
      default: "Information Technology",
    },
    Section: {
      type: String,
    },
    "Year Of Admission": {
      type: String,
      required: true,
    },

    //10th related
    "Tenth Percentage": {
      type: String,
    },
    "Tenth Board Of Study": {
      type: String,
    },
    "Tenth Medium Of Study": {
      type: String,
    },
    "Tenth Year Of Passing": {
      type: String,
    },
    "Tenth School Name": {
      type: String,
    },
    "Tenth Graduating State": {
      type: String,
    },

    //12th related
    "Twelfth Percentage": {
      type: String,
    },
    "Twelfth Board Of Study": {
      type: String,
    },
    "Twelfth Medium Of Study": {
      type: String,
    },
    "Twelfth Year Of Passing": {
      type: String,
    },
    "Twelfth School Name": {
      type: String,
    },
    "Twelfth Graduating State": {
      type: String,
    },

    //Diploma related
    "Diploma Specilazation OR Branch": {
      type: String,
    },
    "Diploma Percentage": {
      type: String,
    },
    "Diploma Year Of Passing": {
      type: String,
    },
    "Name Of Institute": {
      type: String,
    },
    "Diploma Graduating State": {
      type: String,
    },

    //sem related
    "Sem 1 GPA": {
      type: String,
    },
    "Sem 2 GPA": {
      type: String,
    },
    "Sem 3 GPA": {
      type: String,
    },
    "Sem 4 GPA": {
      type: String,
    },
    "Sem 5 GPA": {
      type: String,
    },
    "Sem 6 GPA": {
      type: String,
    },
    "Sem 7 GPA": {
      type: String,
    },
    "Sem 8 GPA": {
      type: String,
    },
    "Overall CGPA": {
      type: String,
    },

    // arrear related
    "Number Of Arrears Sem 1": {
      type: String,
    },
    "Number Of Arrears Sem 2": {
      type: String,
    },
    "Number Of Arrears Sem 3": {
      type: String,
    },
    "Number Of Arrears Sem 4": {
      type: String,
    },
    "Number Of Arrears Sem 5": {
      type: String,
    },
    "Number Of Arrears Sem 6": {
      type: String,
    },
    "Number Of Arrears Sem 7": {
      type: String,
    },
    "Number Of Arrears Sem 8": {
      type: String,
    },
    "Total Number Of Standing Arrears": {
      type: String,
    },
    "Is History Of Arrears": {
      type: String,
    },
    "Number Of History Of Arrears": {
      type: String,
    },

    //contact related
    "Land Line Number": {
      type: String,
    },
    "Primary Number": {
      type: String,
    },
    "Emergency Number": {
      type: String,
    },
    "Primary Email ID": {
      type: String,
      required: true,
    },
    "Alternate Email ID": {
      type: String,
    },

    "Sports Quota": {
      type: String,
    },

    "BEC Status": {
      type: String,
    },
    "BEC Grade": {
      type: String,
    },

    "Languages Known": {
      type: String,
    },
    "Gap In Education": {
      type: String,
    },
    "Is Higher Studies": {
      type: String,
    },

    //TODO: Skill
    "Skill Set": {
      type: String,
    },

    "PAN Number": {
      type: String,
    },
    Nationality: {
      type: String,
    },
    "Indian Passport Number": {
      type: String,
    },
    "Aadhaar Number": {
      type: String,
    },

    "Father Name": {
      type: String,
    },
    "Father Designation": {
      type: String,
    },
    "Father Organization": {
      type: String,
    },
    "Father Mobile Number": {
      type: String,
    },
    "Father Mail ID": {
      type: String,
    },

    "Mother Name": {
      type: String,
    },
    "Mother Designation": {
      type: String,
    },
    "Mother Organization": {
      type: String,
    },
    "Mother Mobile Number": {
      type: String,
    },
    "Mother Mail ID": {
      type: String,
    },

    "Permanent Address": {
      type: String,
    },
    "Permanent Address Line 1": {
      type: String,
    },
    "Permanent Address Line 2": {
      type: String,
    },
    "Permanent City": {
      type: String,
    },
    State: {
      type: String,
    },
    "Postal Code": {
      type: String,
    },

    "Hostel OR Day Scholar": {
      type: String,
    },
    "Is POP2 Training": {
      type: String,
    },

    "Future Skills": {
      type: String,
    },
    encry_password: {
      type: String,
    },
    salt: String,

    role: {
      type: Number,
      default: 0,
    },
    properties: [],
  },
  {
    timestamps: true,
  },
  { strict: false }
);

//TODO: find how password came
studentSchema
  .virtual("password")
  .set(function (password) {
    this._password = password; //password:siva
    this.salt = uuidv4(); //salt:12312312312
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

studentSchema.methods = {
  //for signin
  autheticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("Student", studentSchema);
