const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      minLength: [
        3,
        "The name is too short! The length of name can be minimum 3 characters",
      ],
      maxLength: [
        32,
        "The name is too long! The length of name can be maximum 32 characters",
      ],
    },
    shopName: {
      type: String,
      required: [true, "Shop name is required!"],
      trim: true,
      minLength: [
        8,
        "The shop name is too short! The length of shop name can be minimum 8 characters",
      ],
      maxLength: [
        32,
        "The shop name is too long! The length of shop name can be maximum 32 characters",
      ],
    },
    customerID: {
      type: String,
      required: [true, "Customer ID is required!"],
      unique: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Customer image is required!"],
    },
    nid: {
      type: String,
      required: [true, "NID is required!"],
      // unique: true,
      minLength: [10, "Invalid NID"],
      maxLength: [17, "Invalid NID"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required!"],
      // unique: true,
      maxLength: [11, "Invalid Phone"],
    },
    address: {
      type: String,
      required: [true, "Address is required!"],
      trim: true,
      minLength: [
        3,
        "The address is too short! The length of address can be minimum 3 characters",
      ],
      maxLength: [
        50,
        "The address is too long! The length of address can be maximum 50 characters",
      ],
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
const Customer = model("Customers", customerSchema);

module.exports = Customer;
