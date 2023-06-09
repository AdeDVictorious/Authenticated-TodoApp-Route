const { Todo } = require("./model");
const Review = require("../../models/reviewSchema");

class TodoService {
  async createTodo(data) {
    try {
      let resp = await Todo.create(data);
      return { status: 200, message: "Todo was created successfully" };
    } catch (err) {
      // console.log(err);
      return { status: 400, message: "Todo failed to create" };
    }
  }

  async getTodoById(id) {
    try {
      let resp = await Todo.findById({ _id: id }).populate("review");
      console.log(resp);
      return {
        status: 200,
        result: resp.length,
        message: "Task selected Successfully",
        todo: resp,
      };
    } catch (err) {
      return { status: 400, message: "Task not found" };
    }
  }

  async getAllTodo() {
    try {
      let resp = await Todo.find();
      let estimatedNumber = await Todo.estimatedDocumentCount();
      console.log(resp);
      return {
        status: 200,
        result: resp.length,
        totalNumOfTodo: estimatedNumber,
        message: "All Todo Selected successfully",
        todo: resp,
      };
    } catch (err) {
      return { status: 400, message: "All Todo not found" };
    }
  }

  ////1.) passing data into the Service Controller
  async getTodoByIdAndUpdate(data) {
    try {
      let resp = await Todo.findByIdAndUpdate({ _id: data.id }, data);
      let updatedResp = await Todo.findById({ _id: data.id });
      return {
        status: 200,
        message: "Update using Put was Successful",
        todo: updatedResp,
      };
    } catch (err) {
      return { status: 404, message: "Updating using PUT failed" };
    }
  }

  ////1.) passing data into the Service Controller
  async getByIdAndUpdate(id, data) {
    try {
      let resp = await Todo.findByIdAndUpdate({ _id: id }, data);
      let updatedResp = await Todo.findById({ _id: id });
      return {
        status: 200,
        message: "Update using Patch was Successful",
        todo: updatedResp,
      };
    } catch (err) {
      return { status: 404, message: "Updating using Patch failed" };
    }
  }

  async getTodoByIdAndDelete(id) {
    try {
      let resp = await Todo.findByIdAndDelete({ _id: id });
      return { status: 200, message: "Task deleted successfully" };
    } catch (err) {
      return { status: 404, message: "Task not deleted, try again" };
    }
  }

  async todoIdReviews(data) {
    try {
      let todoReview = await Review.create(data);
      console.log(todoReview, "We are tere and here");

      console.log(todoReview, "Am here at todoReview");
      return {
        status: 200,
        result: todoReview.length,
        message: "The preview was created successfully",
        todoReview,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: "Review for todo with ID Number not created",
      };
    }
  }

  async todoReviewsById(id) {
    try {
      let resp = await Review.findById({ _id: id });

      return {
        status: 200,
        result: resp.length,
        message: "Reviews by ID supply found successfully",
        resp,
      };
    } catch (err) {
      return { status: 404, message: "Reviews by ID supplied was not found" };
    }
  }

  async allTodoReviews(data) {
    try {
      let resp = await Review.find(data);

      return {
        status: 200,
        result: resp.length,
        message: "All Reviews found successfully",
        resp,
      };
    } catch (err) {
      return { status: 404, message: "All Reviews not found" };
    }
  }

  async updateReview(data) {
    try {
      let review = await Review.findByIdAndUpdate({ _id: data.id }, data);
      let updatedReview = await Review.findById({ _id: data.id });

      return {
        status: 200,
        message: " Reviews update successfully",
        updatedReview,
      };
    } catch (err) {
      return { status: 404, message: "Reviews was not updated" };
    }
  }

  async deleteReview(id) {
    try {
      let resp = await Review.findByIdAndDelete({ _id: id });

      return {
        status: 200,
        result: resp.length,
        message: "Review was deleted successfully",
        resp,
      };
    } catch (err) {
      return { status: 404, message: "Review was not deleted successfully" };
    }
  }
}

module.exports = new TodoService();
