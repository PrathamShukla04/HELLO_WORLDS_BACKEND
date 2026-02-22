const Validator = require('validator');

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("This is not valid");
  }

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name length should be between 4 and 50 characters");
  }

  if (!Validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }

  if (!Validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number, and special character"
    );
  }
};

const validateEditedProfileData = (req) => {
    const allowedEditedFields = ['firstName', 'lastName', 'skills', 'about','photourl','age','gender','emailId','githubId','linkedIn','leetcodeId','projects','academicQualifications','certifications'];
    const isEditAllowed=Object.keys(req).every((field)=>
      allowedEditedFields.includes(field)
    );
    return isEditAllowed;
  }
module.exports = {validateSignupData, validateEditedProfileData};