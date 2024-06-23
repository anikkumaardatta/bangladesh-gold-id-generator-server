const fs = require("fs");
const createError = require("http-errors");
const { successResponse, errorResponse } = require("./response.controller");
const Customer = require("../models/customer.model");

const createCustomerId = async (req, res, next) => {
  try {
    const { name, shopName, customerID, nid, phone, address, message } =
      req.body;
      // console.log("DDDDDDDDDD", req)
    const image = req.file;
    if (!image) {
      return next(createError(400, "No file uploaded."));
    }
    const imageUrl = `/images/customers/${image.filename}`;

    const customerExists = await Customer.exists({
      $or: [{ customerID: customerID }, { nid: nid }, { phone: phone }],
    });
    if (customerExists) {
      throw createError(409, "Customer already exists");
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


    await Customer.create(newCustomer);

    return successResponse(res, {
      statusCode: 201,
      message: "CustomerID card created successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
const getCustomers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = req.query.filter || "all";
    const searchRegExp = new RegExp(`.*${search}.*`, "i");
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
      id: { customerID: { $regex: searchRegExp } },
      nid: { nid: { $regex: searchRegExp } },
      phone: { phone: { $regex: searchRegExp } },
    };
    const selectedFilter = filterCriteria[filter] || filterCriteria.all;

    // Fetch customers and count based on the selected filter
    const [customers, count] = await Promise.all([
      Customer.find(selectedFilter)

        .sort({ customerID: 1 })
        .collation({ locale: "en_US", numericOrdering: true })

        .limit(limit)
        .skip((page - 1) * limit),
      Customer.countDocuments(selectedFilter),
    ]);
    if (!customers.length) throw createError(404, "User not found!");
    // Construct pagination details
    const totalPage = Math.ceil(count / limit);
    const pagination = {
      totalPage,
      currentPage: page,
      previousPage: page - 1 > 0 ? page - 1 : null,
      nextPage: page + 1 <= totalPage ? page + 1 : null,
    };
    return successResponse(res, {
      statusCode: 200,
      message: "Customers fetched successfully!",
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
      message: "Customer fetched successfully!",
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

    const customer = await Customer.findById(id, option);

    // Delete image
    const customerImagePath = customer.image;

    fs.access(customerImagePath, (error) => {
      if (error) {
        console.error("Customer image does not exist!");
      } else {
        fs.unlink(customerImagePath, (error) => {
          if (error) throw error;
          console.log("Customer image was deleted!");
        });
      }
    });

    await Customer.findByIdAndDelete({ _id: id });

    return successResponse(res, {
      statusCode: 200,
      message: "Customer deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
const updateCustomerById = async (req, res, next) => {
  const id = req.params.id;
  const updateOptions = {
    new: true,
    renValidators: true,
    context: "query",
  };
  const updates = {};

  return successResponse(res, {
    statusCode: 200,
    message: "Customer updated successfully!",
    payload: {
      customer: req.body,
    },
  });
};
module.exports = {
  createCustomerId,
  getCustomers,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
};

// const getCustomers = async (req, res, next) => {
//   try {
//     const search = req.query.search || "";
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     // Filter Search
//     const filter = req.query.filter || "all";
//     const searchRegExp = new RegExp(".*" + search + ".*", "i");

//     const filterByAll = {
//       $or: [
//         { name: { $regex: searchRegExp } },
//         { shopName: { $regex: searchRegExp } },
//         { customerID: { $regex: searchRegExp } },
//         { nid: { $regex: searchRegExp } },
//         { phone: { $regex: searchRegExp } },
//         { address: { $regex: searchRegExp } },
//       ],
//     };
//     const filterByName = { name: { $regex: searchRegExp } };
//     const filterByShopName = { shopName: { $regex: searchRegExp } };
//     const filterByCustomerID = { customerID: { $regex: searchRegExp } };
//     const filterByNID = { nid: { $regex: searchRegExp } };
//     const filterByPhone = { phone: { $regex: searchRegExp } };

//     let customers = [];
//     let count = null;

//     if (filter == "all") {
//       customers = await Customer.find(filterByAll)
//         .limit(limit)
//         .skip((page - 1) * limit);
//       count = await Customer.find(filterByAll).countDocuments();
//     }
//     else if (filter == "name") {
//       customers = await Customer.find(filterByName)
//         .limit(limit)
//         .skip((page - 1) * limit);
//       count = await Customer.find(filterByName).countDocuments();
//     }
//     else if (filter == "shopName") {
//       customers = await Customer.find(filterByShopName)
//         .limit(limit)
//         .skip((page - 1) * limit);
//       count = await Customer.find(filterByShopName).countDocuments();
//     }
//     else if (filter == "id") {
//       customers = await Customer.find(filterByCustomerID)
//         .limit(limit)
//         .skip((page - 1) * limit);
//       count = await Customer.find(filterByCustomerID).countDocuments();
//     }
//     else if (filter == "nid") {
//       customers = await Customer.find(filterByNID)
//         .limit(limit)
//         .skip((page - 1) * limit);
//       count = await Customer.find(filterByNID).countDocuments();
//     }
//     else if (filter == "phone") {
//       customers = await Customer.find(filterByPhone)
//         .limit(limit)
//         .skip((page - 1) * limit);
//       count = await Customer.find(filterByPhone).countDocuments();
//     }

//     if (!customers) throw next(createError(404, "User not found!"));
//     return successResponse(res, {
//       statusCode: 200,
//       message: "Customers fetched successfully!",
//       payload: {
//         totalCustomer: count,
//         customers: customers,
//         pagination: {
//           totalPage: Math.ceil(count / limit),
//           currentPage: page,
//           previousPage: page - 1 > 0 ? page - 1 : null,
//           nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/////////////////////////////////////////////////////
