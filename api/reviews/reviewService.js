const Review = require("../../models/reviewSchema");

/////---Kept this here because of the getAllReviews the method that is inside it, but review model has been linked to Todo -----///////
class reviewServices {
  async createReview(data) {
    try {
      let { review, rating } = data;
      if (!review || !rating) {
        return { status: 404, message: "Kindly fill all the require field" };
      }

      let newReview = await Review.create(data);
      return {
        status: 201,
        message: "Review created successfully",
        newReview,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: "Review was not created successfully" };
    }
  }

  async todoIdReviews(data) {
    console.log(data, "Am here with the data in Review");
    try {
      let todoReview = await Review.create(data);
      console.log(todoReview, "Am here at todoReview");
      return {
        status: 200,
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

  async getAllReviews() {
    try {
      let reviews = await Review.find();
      // .populate("todo", "todoWriteUp")
      // .populate("user", "name");

      return {
        status: 200,
        message: "Review was found successfully",
        result: reviews.length,
        reviews,
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: "Review was not found successfully" };
    }
  }
}

module.exports = new reviewServices();
