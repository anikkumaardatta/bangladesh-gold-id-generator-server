const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/response.controller");

const runValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
      // return res.status(422).json({ errors: errors.array() });
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = runValidation;
