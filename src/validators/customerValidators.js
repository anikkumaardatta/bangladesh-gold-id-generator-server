const {body} = require("express-validator");

const validateCustomerCreation = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({min: 3, max: 32})
    .withMessage("Name should be at least 3 - 32 characters long!"),
]

module.exports = { validateCustomerCreation }