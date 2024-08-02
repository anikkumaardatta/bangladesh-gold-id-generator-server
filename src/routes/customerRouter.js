const express = require('express');
const runValidation = require('../validators');
const customerRouter = express.Router();
const {
  getCustomers,
  getCustomerById,
  deleteCustomerById,
  createCustomerId,
  updateCustomerById,
} = require('../controllers/customer.controller');
const upload = require('../middlewares/uploadFile');
const { validateCustomerCreation } = require('../validators/customerValidators');

customerRouter.post(
  '/create-id',
  upload.single('customerImage'),
  validateCustomerCreation,
  runValidation,
  createCustomerId
);
customerRouter.get('/', getCustomers);
customerRouter.get('/:id', getCustomerById);
customerRouter.delete('/:id', deleteCustomerById);
customerRouter.put('/:id', upload.single('customerImage'), updateCustomerById);

module.exports = customerRouter;
