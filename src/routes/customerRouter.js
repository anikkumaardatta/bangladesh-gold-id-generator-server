const express = require("express");
const {
  getCustomers,
  getCustomerById,
  deleteCustomerById,
  createCustomerId,
  updateCustomerById,
} = require("../controllers/customer.controller");
const upload = require("../middlewares/uploadFile");
const runValidation = require("../validators");
const {
  validateCustomerCreation,
} = require("../validators/customerValidators");
const checkCustomerExists = require("../middlewares/checkCustomerExists");
const customerRouter = express.Router();

customerRouter.post(
  "/create-id",
  checkCustomerExists,
  upload.single("customerImage"),
  validateCustomerCreation,
  runValidation,

  createCustomerId
);
customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.delete("/:id", deleteCustomerById);
customerRouter.put("/:id", updateCustomerById);

module.exports = customerRouter;
