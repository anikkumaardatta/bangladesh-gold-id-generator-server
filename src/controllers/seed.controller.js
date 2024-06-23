const { data } = require("../data");
const Customer = require("../models/customer.model");

const seedCustomers = async (req, res, next) => {
  try {
    // deleting all existing customers
    await Customer.deleteMany({});

    // Inserting new users
    console.log("dataaaaaaaaa", data.allCustomers)
    const customers = await Customer.insertMany(data.allCustomers);
    
    //successful response
    return res.status(201).json(customers);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedCustomers };
