const multer = require("multer");

const storage = multer.diskStorage({});

const resumeUpload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB, jaisa frontend pe bhi likha hai
  },
});

module.exports = resumeUpload;