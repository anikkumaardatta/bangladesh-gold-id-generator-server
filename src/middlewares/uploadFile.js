const multer = require('multer');
const path = require('path');
const createError = require('http-errors');
const { uploadDirectory, maxFileSize, allowedFileTypes } = require('../secret');
const Customer = require('../models/customer.model');
const { findWithCustomer_Id } = require('../services/finding.services');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const extensionName = path.extname(file.originalname);
    cb(null, file.fieldname.slice(0, 1) + '-' + Date.now() + extensionName);
  },
});

const fileFilter = async (req, file, cb) => {
  const id = req.params.id;
  const { customerID, nid, phone } = req.body;
  const extensionName = path.extname(file.originalname);
  const customer = await Customer.findById(id);

  if (req.method == 'POST') {
    const customerExists = await Customer.exists({
      $or: [{ customerID: customerID }, { nid: nid }, { phone: phone }],
    });
    if (customerExists) {
      return cb(createError(400, 'Failed to uploading file! The customer already exists'));
    }
  }
  if (!customer) {
    return cb(createError(400, 'Failed to uploading file! The customer does not exist'));
  }

  if (!allowedFileTypes.includes(extensionName.substring(1))) {
    return cb(createError(400, 'Invalid file type! Only allow for (.jpeg .jpg .png)'));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
  fileFilter,
});

module.exports = upload;
