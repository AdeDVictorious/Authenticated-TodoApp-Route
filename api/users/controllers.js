const express = require("express");
const uploadUserPhoto = require("../../middleware/uploadUserPhoto");
const resizeUserPhoto = require("../../middleware/resizeImage");
const Services = require("./service");
const userAuth = require("../../middleware/authUser");
const adminAuth = require("../../middleware/authAdmin");

const userRoute = express();

//Beginning of Personal update
userRoute.get("/Me", userAuth, async (req, res) => {
  console.log(req.userInfo._id, req.body);
  let data = { ...req.userInfo };
  const response = await Services.Me(data);
  res.status(response.status).json(response);
});

userRoute.patch("/updatePwds", userAuth, async (req, res) => {
  console.log(req.userInfo._id, req.body);
  let data = {
    ...req.userInfo,
    ...req.body,
  };

  console.log(data, data._id, "welcome 1");

  const response = await Services.updatePwd(data);
  res.status(response.status).json(response);
});

userRoute.patch(
  "/updateMe",
  userAuth,
  uploadUserPhoto,
  resizeUserPhoto,
  async (req, res) => {
    console.log(req.file, "Am here at req");

    let data = {
      ...req.userInfo,
      ...req.body,
      ...req.file,
      ...req.file.filename,
    };
    const pwdUpdate = await Services.updateMe(data);
    res.status(pwdUpdate.status).json(pwdUpdate);
  }
);

userRoute.delete("/deleteMe", userAuth, async (req, res) => {
  console.log(req.userInfo._id);
  const response = await Services.deleteMe(req.userInfo._id);
  res.status(response.status).json(response);
});
//the end of Personal update

/////These route below are restricted to Admin Only
userRoute.get("/user/:id", adminAuth, async (req, res, next) => {
  // console.log(req, "Am here at thhr");
  // console.log(req.params.id);
  const response = await Services.getUserById(req.params.id);
  res.status(response.status).json(response);
});

userRoute.get("/user", adminAuth, async (req, res) => {
  console.log(req.query, "Am here at req.query");
  const response = await Services.getAllUser(req.query);
  res.status(response.status).json(response);
});

userRoute.patch("/user/:id", adminAuth, async (req, res) => {
  console.log(req.params.id, req.body);
  const response = await Services.getUserByIdAndUpdate(req.params.id, req.body);
  res.status(response.status).json(response);
});

userRoute.delete("/user/:id", adminAuth, async (req, res) => {
  console.log(req.params.id);
  const response = await Services.getUserByIdAndDelete(req.params.id);
  res.status(response.status).json(response);
});

////This code is dangerous as it delete all database record: Dont use
// userRoute.delete("/user", adminAuth, async (req, res) => {
//   console.log(req.body);
//   let response = await Services.getUserAndDeleteMany();
//   res.status(response.status).json(response);
// });

module.exports = userRoute;
