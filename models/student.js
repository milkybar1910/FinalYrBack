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
      default: "00.00",
    },
    "Twelfth Board Of Study": {
      type: String,
      default: "NA",
    },
    "Twelfth Medium Of Study": {
      type: String,
      default: "NA",
    },
    "Twelfth Year Of Passing": {
      type: String,
      default: "0000",
    },
    "Twelfth School Name": {
      type: String,
      default: "NA",
    },
    "Twelfth Graduating State": {
      type: String,
      default: "NA",
    },

    //Diploma related
    "Diploma Specilazation OR Branch": {
      type: String,
      default: "NA",
    },
    "Diploma Percentage": {
      type: String,
      default: "0.00",
    },
    "Diploma Year Of Passing": {
      type: String,
      default: "0000",
    },
    "Name Of Institute": {
      type: String,
      default: "NA",
    },
    "Diploma Graduating State": {
      type: String,
      default: "NA",
    },

    //sem related
    "Sem 1 GPA": {
      type: String,
      default: "0.00",
    },
    "Sem 2 GPA": {
      type: String,
      default: "0.00",
    },
    "Sem 3 GPA": {
      type: String,
      default: "0.00",
    },
    "Sem 4 GPA": {
      type: String,
      default: "0.00",
    },
    "Sem 5 GPA": {
      type: String,
      default: "0.00",
    },
    "Sem 6 GPA": {
      type: String,
      default: "0.00",
    },
    "Sem 7 GPA": {
      type: String,
      default: "0.00",
    },
    "Sem 8 GPA": {
      type: String,
      default: "0.00",
    },
    "Overall CGPA": {
      type: String,
      default: "0.00",
    },

    // arrear related
    "Number Of Arrears Sem 1": {
      type: String,
      default: "0",
    },
    "Number Of Arrears Sem 2": {
      type: String,
      default: "0",
    },
    "Number Of Arrears Sem 3": {
      type: String,
      default: "0",
    },
    "Number Of Arrears Sem 4": {
      type: String,
      default: "0",
    },
    "Number Of Arrears Sem 5": {
      type: String,
      default: "0",
    },
    "Number Of Arrears Sem 6": {
      type: String,
      default: "0",
    },
    "Number Of Arrears Sem 7": {
      type: String,
      default: "0",
    },
    "Number Of Arrears Sem 8": {
      type: String,
      default: "0",
    },
    "Total Number Of Standing Arrears": {
      type: String,
      default: "0",
    },
    "Is History Of Arrears": {
      type: String,
    },
    "Number Of History Of Arrears": {
      type: String,
      default: "0",
    },

    //contact related
    "Land Line Number": {
      type: String,
      default: "0000000000",
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
      default: "NA",
    },
    "BEC Grade": {
      type: String,
      default: "NA",
    },

    "Languages Known": {
      type: String,
    },
    "Gap In Education": {
      type: String,
      default: "0",
    },
    "Is Higher Studies": {
      type: String,
    },

    //TODO: Skill
    "Skill Set": {
      type: String,
      default: "NA",
    },

    "PAN Number": {
      type: String,
      default: "NA",
    },
    Nationality: {
      type: String,
    },
    "Indian Passport Number": {
      type: String,
      default: "NA",
    },
    "Aadhaar Number": {
      type: String,
      default: "NA",
    },

    "Father Name": {
      type: String,
      default: "NA",
    },
    "Father Designation": {
      type: String,
      default: "NA",
    },
    "Father Organization": {
      type: String,
      default: "NA",
    },
    "Father Mobile Number": {
      type: String,
      default: "0000000000",
    },
    "Father Mail ID": {
      type: String,
      default: "NA",
    },

    "Mother Name": {
      type: String,
      default: "NA",
    },
    "Mother Designation": {
      type: String,
      default: "NA",
    },
    "Mother Organization": {
      type: String,
      default: "NA",
    },
    "Mother Mobile Number": {
      type: String,
      default: "0000000000",
    },
    "Mother Mail ID": {
      type: String,
      default: "NA",
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
    CoverPhoto: {
      data: Buffer,
      contentType: String,
    },
    ProfilePhoto: {
      data: Buffer,
      contentType: String,
    },
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
