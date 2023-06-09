///// This Code is abandon due to it diffculty encounter in it, to build or work on it later as I become more professional in Web programming, but for now I will be making use of try and catch method

// const AppError = require("../utils/appError");

// //This handle Error from invalid ID input by the client and send in production ENV
// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value._id}.`;
//   return new AppError(message, 404);
// };

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.keyValue.email;

//   // const keyValue = err.keyValue.email;
//   const message = `Duplicate field value: ${value}. Please use another value`;
//   return new AppError(message, 400);
// };

// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);

//   const message = `Invalid input data. ${error.join(". ")}`;
//   return new AppError(message, 400);
// };

// const sendErrorDev = (err, res) => {
//   console.log(err, "THEM THEM ERROR");
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };

// const sendErrorProd = (err, res) => {
//   //Operational, trusted error, Send to the client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });

//     //Programming or other error: dont leak error details
//   } else {
//     //1.) Log error
//     console.log("Error", err);

//     //2.) Send generic message
//     res.status(500).json({ status: "error", message: "Something went wrong" });
//   }
// };

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.statusCode || "error";

//   console.log(err.statusCode, err.status, err.message, "Am here at Error");

//   if (process.env.NODE_ENV == "development") {
//     sendErrorDev(err, res);

//     console.log(err, "This is the Error1111");
//   } else if (process.env.NODE_ENV == "production") {
//     let error = err;
//     console.log(error, "Am here at error@error");

//     if (error.name == "CastError") error = handleCastErrorDB(error);

//     if (error.code === 11000) error = handleDuplicateFieldsDB(error);

//     if (error.name === ValidationError) error = handleValidationErrorDB(error);

//     sendErrorProd(error, res);

//     console.log(error, "This is the Error11111234");
//   }
// };
