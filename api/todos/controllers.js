const express = require("express");
const Services = require("./service");
const authUser = require("../../middleware/authUser");
const authAdmin = require("../../middleware/authAdmin");

let todoRoute = express();

todoRoute.post("/todo", authUser, async (req, res) => {
  console.log(req.body);
  let response = await Services.createTodo(req.body);
  res.status(response.status).json(response);
});

todoRoute.get("/todo/:id", authUser, async (req, res) => {
  console.log(req.params.id);
  let response = await Services.getTodoById(req.params.id);
  res.status(response.status).json(response);
});

todoRoute.get("/todo", authUser, async (req, res) => {
  console.log(req.body);
  let response = await Services.getAllTodo();
  res.status(response.status).json(response);
});

////1.)  How to pass data into Service Controller
todoRoute.put("/todo/:id", authUser, async (req, res) => {
  console.log(req.params, req.body);
  let data = {
    ...req.params,
    ...req.body,
  };
  let response = await Services.getTodoByIdAndUpdate(data);
  res.status(response.status).json(response);
});

////2.) another way to pass data into Service Controller
todoRoute.patch("/todo/:id", authUser, async (req, res) => {
  console.log(req.params.id, req.body);
  let response = await Services.getByIdAndUpdate(req.params.id, req.body);
  res.status(response.status).json(response);
});

todoRoute.delete("/todo/:id", authUser, async (req, res) => {
  console.log(req.params.id);
  let response = await Services.getTodoByIdAndDelete(req.params.id);
  res.status(response.status).json(response);
});

todoRoute.post("/review", authUser, async (req, res) => {
  console.log(req.params, req.body, "Am here Am here");
  let data = {
    // ...req.params,
    ...req.body,
    // ...req.userInfo,
  };
  let resp = await Services.todoIdReviews(data);
  res.status(resp.status).json(resp);
});

todoRoute.get("/review/:id", authAdmin, async (req, res) => {
  console.log(req.params.id, "Am here Am here");
  let resp = await Services.todoReviewsById(req.params.id);
  res.status(resp.status).json(resp);
});

todoRoute.get("/review", authAdmin, async (req, res) => {
  console.log(req.body, "Am here Am here");
  let resp = await Services.allTodoReviews(req.body);
  res.status(resp.status).json(resp);
});

todoRoute.patch("/review/:id", authAdmin, async (req, res) => {
  let data = {
    ...req.params,
    ...req.body,
  };

  let resp = await Services.updateReview(data);
  res.status(resp.status).json(resp);
});

todoRoute.delete("/review/:id", authAdmin, async (req, res) => {
  console.log(req.params.id, "Am here Am here");
  let resp = await Services.deleteReview(req.params.id);
  res.status(resp.status).json(resp);
});

module.exports = todoRoute;
