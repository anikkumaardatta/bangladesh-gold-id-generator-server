const { Schema, model } = require('mongoose');
const { defaultUserImgPath } = require('../secret');

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required!'],
      trim: true,
    },
    customerID: {
      type: String,
      required: [true, 'Customer ID is required!'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image Url is required!'],
      default: defaultUserImgPath,
    },
    nid: {
      type: String,
      required: [true, 'NID is required!'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required!'],
    },
    address: {
      type: String,
      required: [true, 'Address is required!'],
      trim: true,
    },
    message: {
      type: String,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Customer = model('Customers', customerSchema);

module.exports = Customer;
