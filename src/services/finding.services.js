const createError = require('http-errors');
const { mongoose } = require('mongoose');
const Customer = require('../models/customer.model');

const findWithCustomer_Id = async (id, option = {}) => {
  try {
    const item = await Customer.findById(id, option);
    if (!item) {
      throw createError(404, "Customer doesn't exist!");
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, `Invalid Customer id!`);
    }
    throw error;
  }
};

module.exports = {
  findWithCustomer_Id,
};
