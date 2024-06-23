require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 5000;
const mongoDBCompassUrl =
  process.env.MONGODB_COMPASS_URL || `mongodb://localhost:27017/bdg`;
// const defaultUserImgPath =
//   process.env.DEFAULT_USER_IMAGE_PATH ||
//   "../public/images/users/userDefault.png";
const uploadDirectory = process.env.UPLOAD_FILE || "public/images/customers";
const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 1048576;
const allowedFileTypes = process.env.ALLOWED_FILE_TYPES || [
  "jpeg",
  "jpg",
  "png",
];

module.exports = {
  serverPort,
  mongoDBCompassUrl,
  //   defaultUserImgPath,
  uploadDirectory,
  maxFileSize,
  allowedFileTypes,
};
