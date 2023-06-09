const express = require("express");
const Services = require("./servControl");
const authRequire = require("../../middleware/authAdmin");

const adminRoute = express();

adminRoute.get("/admin/:id", authRequire, async (req, res) => {
  console.log(req.params.id);
  const response = await Services.getadminById(req.params.id);
  res.status(response.status).json(response);
});

adminRoute.get("/admin", authRequire, async (req, res) => {
  const response = await Services.getAlladmin(req.body);
  res.status(response.status).json(response);
});

adminRoute.put("/admin/:id", authRequire, async (req, res) => {
  console.log(req.params.id, req.body);
  const response = await Services.getByIdAndUpdate(req.params.id, req.body);
  res.status(response.status).json(response);
});

adminRoute.patch("/admin/:id", authRequire, async (req, res) => {
  console.log(req.params.id, req.body);
  const response = await Services.getadminByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.status(response.status).json(response);
});

adminRoute.delete("/admin/:id", authRequire, async (req, res) => {
  console.log(req.params.id);
  const response = await Services.getadminByIdAndDelete(req.params.id);
  res.status(response.status).json(response);
});

// restrictTo("lead manager"),

// //This code is dangerous as it delete all database record: Dont use
// adminRoute.delete("/admin", authRequire, async (req, res) => {
//   console.log(req.body);
//   let response = await Services.getadminAndDeleteMany();
//   res.status(response.status).json(response);
// });

module.exports = adminRoute;
