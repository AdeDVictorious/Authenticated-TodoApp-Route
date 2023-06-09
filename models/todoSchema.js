const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    todoWriteUp: {
      type: "string",
      required: [true, "A todo must have a write up"],
      trim: true,
    },
    status: {
      type: "string",
      required: [true, "A todo must have a status"],
      trim: true,
    },
    timeAndDate: {
      type: Date,
    },
    // other example from the lecture
    // createdAt: {
    //   type: Boolean,
    //   default: Date.now(),
    //   select: false,
    // },
    // startDates: [Date],
    // secretTour: {
    //   type: Boolean,
    //   default: false
    // },
    //   startLocation: {
    //     ////GeoJSON
    //     type: String,
    //     default: "Point",
    //     enum: ["Point"],
    //   },
    //   corodinates: [Number],
    //   address: String,
    //   description: String,
    // },
    // locations: [
    //   {
    //     type: {
    //       type: String,
    //       default: "Points",
    //       enum: ["Points"],
    //     },
    //     corodinates: [Number],
    //     address: String,
    //     description: String,
    //     day: Number,
    //   }
    // ]
    // guides: Array, ///This for Embedded Means of writing the schema type

    // guides: [
    //   {
    //     type: mongoose.Schema.ObjectId,

    //     ////This is pointing reference to thw User Model
    //     ref: "User",
    //   },
    // ],

    ////This is extra features that allow the schema to capture any other Object that the database specified but not in our Schema
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ///This is use for EMBEDDING the guides into the todoSchema, It a Schema Method on pre save Instruction, where the User ID is embedded into the TodoSchema, as an Object
// todoSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//// This will be executed in the query of the Get All Todo and Get Todo By ID
// todoSchema.pre(/^find/, function(next) {
//   this.populate: [{
//     path: "guides",
//     select:'-__v -passwordChangedAt'
//   }]
// })

/////This is a virtual property that all an array to show the reviews without having been stored in te database
todoSchema.virtual("review", {
  ref: "Review",
  foreignField: "todo",
  localField: "_id",
});

const Todo = new mongoose.model("Todo", todoSchema);

module.exports = Todo;
