const mongoose = require("mongoose");
///We import the folder for both the TODO and the USER
const Todo = require("./todoSchema");
const User = require("./userSchema");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review must not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    todoId: {
      type: String,
      required: [true, "Review must have a Todo Id"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    /////1.)This will be use to link up the TodoID and UserId from their Schema executed in the post request for a new review, while the query of the Get All Todo and Get Todo By ID.
    ////2.)this line of code will not work if the reviewSchema.pre outside the schema is  not active and not commented(////). But it will not work with todoId inside the Schema above this code.

    /////This is a reference to both todo and User Schema. This is an advance features.....

    // todo: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Todo",
    //   required: [true, "Review must belong to a todo"],
    // },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: [true, "Review must belong to a user"],
    // },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

// reviewSchema.index({ todo: 1, user: 1 }, { unique: true });

///////1.)This will be executed in the query of the Get All Todo and Get Todo By ID
//////2.)this line of code will not work if the todo and user inside the schema is not active and not commented(////). But it will not work with todoId inside the Schema above this code

reviewSchema.pre(/^find/, function (next) {
  ////this line of code will make todo to populate twice when we try to find TodoById
  // this.populate({
  //   path: "todo",
  //   select: "todoWriteUp",
  // }).populate({
  //   path: "user",
  //   select: "name, photo",
  // });

  this.populate({
    path: "user",
    select: "name, photo",
  });

  next();
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
