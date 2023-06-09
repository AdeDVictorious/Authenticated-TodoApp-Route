const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  todo: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Booking must belong to a Tour"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Booking must belong to a User"],
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "todo",
    select: name,
  });
});
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
