const express = require("express");
const Services = require("./services");
const authUser = require("../../middleware/authUser");
const authAdmin = require("../../middleware/authAdmin");

let bookingRoute = express();

//////----This place was suppose to be for intergrating the Stripe payment platform, but it's not allowed in Nigeria, So,the CRUD Operation here is just for format sake. will improve this portion of code in days to come -----/////////
bookingRoute.post("/booking", authUser, async (req, res) => {
  console.log(req.body);
  let response = await Services.createBooking(req.body);
  res.status(response.status).json(response);
});

/////These route below are restricted to Admin Only
bookingRoute.get("/booking/:id", authAdmin, async (req, res) => {
  console.log(req.params.id);
  let response = await Services.getBookingById(req.params.id);
  res.status(response.status).json(response);
});

bookingRoute.get("/booking", authAdmin, async (req, res) => {
  console.log(req.body);
  let response = await Services.getAllBooking();
  res.status(response.status).json(response);
});

////1.)  How to pass data into Service Controller
bookingRoute.put("/booking/:id", authAdmin, async (req, res) => {
  console.log(req.params, req.body);
  let data = {
    ...req.params,
    ...req.body,
  };
  let response = await Services.getBookingByIdAndUpdate(data);
  res.status(response.status).json(response);
});

////2.) another way to pass data into Service Controller
bookingRoute.patch("/booking/:id", authAdmin, async (req, res) => {
  console.log(req.params.id, req.body);
  let response = await Services.getByIdAndUpdate(req.params.id, req.body);
  res.status(response.status).json(response);
});

bookingRoute.delete("/booking/:id", authAdmin, async (req, res) => {
  console.log(req.params.id);
  let response = await Services.getBookingByIdAndDelete(req.params.id);
  res.status(response.status).json(response);
});

module.exports = bookingRoute;
