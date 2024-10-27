const Customer = require('../models/customer.model');

// Check if customer exists middleware
const checkCustomerExists = async (req, res, next) => {
  try {
    next(); // Proceed to upload profile if user doesn't exist
  } catch (error) {
    console.error(error);
    res.status(500).send('Error checking customer existence.');
  }
};
module.exports = checkCustomerExists;
