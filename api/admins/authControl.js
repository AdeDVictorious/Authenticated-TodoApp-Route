const jwt = require("jsonwebtoken");
const express = require("express");
const Services = require("./servControl");

const adminSignupRoute = express();
const adminLoginRoute = express();

adminSignupRoute.post("/signup", async (req, res) => {
  console.log(req.body);
  const newadmin = await Services.signupadmin(req.body);
  res.status(newadmin.status).json(newadmin);
});

adminLoginRoute.post("/login", async (req, res) => {
  console.log(req.body);
  const adminLogin = await Services.loginadmin(req.body);
  res.status(adminLogin.status).json(adminLogin);
});

module.exports = {
  adminSignupRoute,
  adminLoginRoute,
};
