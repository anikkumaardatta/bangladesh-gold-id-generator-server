const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const { errorResponse } = require("./controllers/response.controller");
const customerRouter = require("./routes/customerRouter");
const bodyParser = require("body-parser");

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(xssClean());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files (including images)
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// routes definition
app.use("/api/customers", customerRouter)

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to Bangladesh Gold ID Card making system API",
  });
});
app.get("/api/customers", (req, res) => {
    res.status(200).send({
      message: "Customers info returned successfully.",
    });
  });

// Client Error Handling==========!!!!!!!
app.use((req, res, next) => {
  next(createError(404, "Route not found!"));
});
// Server Error Handling==========!!!!!!! -> all the errors handle from here.
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});
module.exports = app;
