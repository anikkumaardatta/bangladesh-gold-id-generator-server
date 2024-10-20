const createError = require('http-errors');
const { successResponse } = require('./response.controller');
const Customer = require('../models/customer.model');
const { findWithCustomer_Id } = require('../services/finding.services');
const { deleteImage } = require('../helper/deleteImage');
const { maxFileSize } = require('../secret');

const createCustomerId = async (req, res, next) => {
  try {
    const { name, shopName, customerID, nid, phone, address, message } = req.body;
    const image = req.file;
    if (!image) {
      return next(createError(400, 'No file uploaded.'));
    }
    if (image.size > maxFileSize) {
      throw createError(400, `File too large. It must be less than ${maxFileSize / 1024 / 1024}MB`);
    }
    const imageUrl = `/images/customers/${image.filename}`;

    const customerExists = await Customer.exists({
      $or: [{ customerID: customerID }, { nid: nid }, { phone: phone }],
    });
    if (customerExists) {
      throw createError(409, 'Customer already exists');
    }

    const newCustomer = {
      name,
      shopName,
      customerID,
      imageUrl,
      nid,
      phone,
      address,
      message,
    };

    const createdCustomer = await Customer.create(newCustomer);
    return successResponse(res, {
      statusCode: 201,
      message: 'CustomerID card created successfully!',
      payload: { createdCustomer },
    });
  } catch (error) {
    next(error);
  }
};
const getCustomers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = req.query.filter || 'all';
    const searchRegExp = new RegExp(`.*${search}.*`, 'i');
    // Define filter criteria based on the filter type
    const filterCriteria = {
      all: {
        $or: [
          { name: { $regex: searchRegExp } },
          { shopName: { $regex: searchRegExp } },
          { customerID: { $regex: searchRegExp } },
          { nid: { $regex: searchRegExp } },
          { phone: { $regex: searchRegExp } },
          { address: { $regex: searchRegExp } },
        ],
      },
      name: { name: { $regex: searchRegExp } },
      shopName: { shopName: { $regex: searchRegExp } },
      customerID: { customerID: { $regex: searchRegExp } },
      nid: { nid: { $regex: searchRegExp } },
      phone: { phone: { $regex: searchRegExp } },
    };
    const selectedFilter = filterCriteria[filter] || filterCriteria.all;

    // Fetch customers and count based on the selected filter
    const [customers, count] = await Promise.all([
      Customer.find(selectedFilter)

        // .sort({ customerID: 1 })
        .collation({ locale: 'en_US', numericOrdering: true })

        .limit(limit)
        .skip((page - 1) * limit),
      Customer.countDocuments(selectedFilter),
    ]);
    // Construct pagination details
    const totalPage = Math.ceil(count / limit);
    const pagination = {
      totalPage,
      currentPage: page,
      previousPage: page - 1 > 0 ? page - 1 : null,
      nextPage: page + 1 <= totalPage ? page + 1 : null,
    };
    if (!customers.length) {
      return successResponse(res, {
        statusCode: 404,
        message: 'No customers available, Please create customer!',
        payload: {
          totalCustomer: count,
          pagination,
          customers,
        },
      });
    }
    return successResponse(res, {
      statusCode: 200,
      message: 'Customers fetched successfully!',
      payload: {
        totalCustomer: count,
        pagination,
        customers,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getCustomerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const option = { __v: 0 };
    const customer = await Customer.findById(id, option);
    return successResponse(res, {
      statusCode: 200,
      message: 'Customer fetched successfully!',
      payload: {
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
};
const deleteCustomerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const option = { __v: 0 };
    const customer = await findWithCustomer_Id(id, option);
    // Delete image
    const customerImagePath = `public${customer.imageUrl}`;
    deleteImage(customerImagePath);
    const deletedCustomer = await Customer.findByIdAndDelete({ _id: id });

    if (!deletedCustomer) {
      throw createError(404, "Customer with this ID does't exist!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Customer deleted successfully!',
      payload: {
        deletedCustomer,
      },
    });
  } catch (error) {
    next(error);
  }
};
const updateCustomerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateOptions = { new: true, runValidators: true, context: 'query' };

    const customer = await Customer.findById(id);

    let updates = {};

    for (let key in req.body) {
      if (['name', 'shopName', 'customerID', 'nid', 'phone', 'address', 'message'].includes(key)) {
        updates[key] = req.body[key];
      } else {
        throw createError(400, 'Invalid field');
      }
    }
    if (!customer) {
      throw createError(404, "Customer with this ID does't exist!");
    }
    const image = req.file;
    if (image) {
      if (image.size > maxFileSize) {
        throw createError(400, `File too large. It must be less than ${maxFileSize / 1024 / 1024}MB`);
      }

      const customerImagePath = `public${customer.imageUrl}`;
      deleteImage(customerImagePath);
      updates.imageUrl = `/images/customers/${image.filename}`;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, updateOptions);

    if (!updatedCustomer) {
      throw createError(404, "Customer with this ID does't exist!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Customer updated successfully!',
      payload: {
        updatedCustomer: updatedCustomer,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createCustomerId,
  getCustomers,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
};
