const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { uploadDirectory, maxFileSize, allowedFileTypes } = require("../secret");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const extensionName = path.extname(file.originalname);
    cb(
      null,
      file.fieldname.slice(0, 1) +
        "-" +
        Date.now() +
        extensionName
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extensionName = path.extname(file.originalname);
  if (!allowedFileTypes.includes(extensionName.substring(1))) {
    return cb(
      createError(400, "Invalid file type! Only allow for (.jpeg .jpg .png)")
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
  fileFilter
});

module.exports = upload;
