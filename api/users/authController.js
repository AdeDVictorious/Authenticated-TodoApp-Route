const jwt = require("jsonwebtoken");
const express = require("express");
const Services = require("./service");
const requireAuth = require("../../middleware/authUser");

const signupRoute = express();
const loginRoute = express();
const userforgetPwdRoute = express();
const userResetPwdRoute = express();

signupRoute.post("/signup", async (req, res) => {
  console.log(req.body);
  const newUser = await Services.signupUser(req.body);
  res.status(newUser.status).json(newUser);
});

loginRoute.post("/login", async (req, res) => {
  console.log(req.body);
  const userLogin = await Services.loginUser(req.body);
  res.status(userLogin.status).json(userLogin);
});

userforgetPwdRoute.post("/forgetPassword", async (req, res) => {
  console.log(req.body);
  const userPwdForget = await Services.PwdForget(req.body);
  res.status(userPwdForget.status).json(userPwdForget);
});

userResetPwdRoute.patch("/resetPassword/:token", async (req, res) => {
  console.log(req.params.token, req.body);
  const userResetPwd = await Services.PwdReset(req.params.token, req.body);
  res.status(userResetPwd.status).json(userResetPwd);
});

module.exports = {
  signupRoute,
  loginRoute,
  userforgetPwdRoute,
  userResetPwdRoute,
};
