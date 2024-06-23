const express = require("express");
const { seedCustomers } = require("../controllers/seed.controller");
const seedRouter = express.Router();

seedRouter.get("/customers", seedCustomers)

module.exports = seedRouter;