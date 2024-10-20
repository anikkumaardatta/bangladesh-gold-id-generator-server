const { Schema, model } = require('mongoose');
const { defaultUserImgPath } = require('../secret');

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      trim: true,
      minLength: [3, 'The name is too short! The length of name can be minimum 3 characters'],
      maxLength: [32, 'The name is too long! The length of name can be maximum 32 characters'],
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required!'],
      trim: true,
      minLength: [8, 'The shop name is too short! The length of shop name can be minimum 8 characters'],
      maxLength: [32, 'The shop name is too long! The length of shop name can be maximum 32 characters'],
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
      // unique: true,
      maxLength: [11, 'Invalid Phone'],
    },
    address: {
      type: String,
      required: [true, 'Address is required!'],
      trim: true,
      minLength: [3, 'The address is too short! The length of address can be minimum 3 characters'],
      maxLength: [50, 'The address is too long! The length of address can be maximum 50 characters'],
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
