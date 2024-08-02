const Customer = require('../models/customer.model');

// Check if customer exists middleware
const checkCustomerExists = async (req, res, next) => {
  // const { customerID, nid, phone } = req.body;
  console.log('hhhhhhhhhh1', req.body);
  try {
    // const customerExists = await Customer.exists({
    //   // $or: [{ customerID: customerID }, { nid: nid }, { phone: phone }],
    // });
    // if (customerExists) {
    //   return res.status(400).send("The customer already exists.");
    // }
    next(); // Proceed to upload profile if user doesn't exist
  } catch (error) {
    console.error(error);
    res.status(500).send('Error checking customer existence.');
  }
};
module.exports = checkCustomerExists;
