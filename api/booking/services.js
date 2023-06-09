// // const stripe = require("stripe")('sk_test_...');    ////The SK_TEST is available in the Stripe Dashboard. NIgeria is not amount the country allow to use this service
const { Booking } = require("./model");
const Todo = require("../../models/todoSchema");
const User = require("../../models/userSchema");

//////----This place was suppose to be for intergrating the Stripe payment platform, but it's not allowed in Nigeria, So event the CRUD Operation here is just for format sake. will improve this portion of code in days to come ------///////
class bookingServices {
  async createBooking(data) {
    console.log(data);
    try {
      let resp = await Booking.create(data);
      console.log(resp);
      return { status: 200, message: "Booking was created successfully" };
    } catch (err) {
      console.log(err);
      return { status: 400, message: "Booking failed to create" };
    }
  }

  async getBookingById(id) {
    try {
      let resp = await Booking.findById({ _id: id })
        .populate("user")
        .populate("todo");
      console.log(resp);
      return {
        status: 200,
        result: resp.length,
        message: "Task selected Successfully",
        resp,
      };
    } catch (err) {
      return { status: 400, message: "Task not found" };
    }
  }

  async getAllbooking() {
    try {
      let resp = await Booking.find();
      let estimatedNumber = await Booking.estimatedDocumentCount();
      console.log(resp);
      return {
        status: 200,
        result: resp.length,
        totalNumOfBooking: estimatedNumber,
        message: "All Booking Selected successfully",
        resp,
      };
    } catch (err) {
      return { status: 400, message: "All Booking not found" };
    }
  }

  ////1.) passing data into the Service Controller
  async getBookingByIdAndUpdate(data) {
    try {
      let resp = await Booking.findByIdAndUpdate({ _id: data.id }, data);
      let updatedResp = await Booking.findById({ _id: data.id });
      return {
        status: 200,
        message: "Update using Put was Successful",
        updatedResp,
      };
    } catch (err) {
      return { status: 404, message: "Updating using PUT failed" };
    }
  }

  ////1.) passing data into the Service Controller
  async getByIdAndUpdate(id, data) {
    try {
      let resp = await Booking.findByIdAndUpdate({ _id: id }, data);
      let updatedResp = await Booking.findById({ _id: id });
      return {
        status: 200,
        message: "Update using Patch was Successful",
        updatedResp,
      };
    } catch (err) {
      return { status: 404, message: "Updating using Patch failed" };
    }
  }

  async getBookingByIdAndDelete(id) {
    try {
      let resp = await Booking.findByIdAndDelete({ _id: id });
      return { status: 200, message: "Task deleted successfully" };
    } catch (err) {
      return { status: 404, message: "Task not deleted, try again" };
    }
  }
}

module.exports = new bookingServices();
