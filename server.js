const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
// const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

///ROUTES

let todoRoute = require("./api/todos/controllers");

let {
  signupRoute,
  loginRoute,
  userforgetPwdRoute,
  userResetPwdRoute,
} = require("./api/users/authController");

let { adminSignupRoute, adminLoginRoute } = require("./api/admins/authControl");

let userRoute = require("./api/users/controllers");
let bookingRoute = require("./api/booking/controller");
let adminRoute = require("./api/admins/controller");

//Express Middleware function
let app = express();

//   dotenv.config({ path: ".configDev.env" });
//   // app.use(morgan("dev"));

app.use(helmet());

//Body-parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));

// // // //Data Sanitization against NoSQL query injection
// app.use(mongoSanitize);

//Data Sanitization against XSS
app.use(xss());

//HPP prevent parameter pollution
app.use(hpp());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//rate limit middleware, limit the request from same API
const limiter = rateLimit({
  max: 100, ///This rate can be increase of decrease depending on the nature of the application
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, Please try again in an hour",
});

app.use("/api", limiter);

let dbConnect = async () => {
  try {
    let connect = await mongoose.connect(
      "mongodb+srv://AdeDVictorious:kKsrJeEmizPvEYW6@todo.m2ql8id.mongodb.net/project-2",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connection to mongodb was successful");
  } catch (err) {
    console.log("failed to connect mongodb");
  }
};

dbConnect();

app.use("/api/v2/todos", todoRoute);

app.use("/api/v2", signupRoute);
app.use("/api/v2", loginRoute);
app.use("/api/v2/admin", adminSignupRoute);
app.use("/api/v2/admin", adminLoginRoute);
app.use("/api/v2", userforgetPwdRoute);
app.use("/api/v2", userResetPwdRoute);
app.use("/api/v2/users", userRoute);
app.use("/api/v2", bookingRoute);
app.use("/api/v2", adminRoute);

////For All Route handle checker if a User type in a wrong handler
app.all("*", (req, res, next) => {
  return {
    status: 400,
    message: "the url requested for was not found on this sever",
  };
});

////config.env middleware reader, where sensitive data are saved
process.env.NODE_ENV = "development";
console.log(process.env.NODE_ENV);

let PORT;

if (process.env.NODE_ENV == "production") {
  dotenv.config({ path: "./configProd.env" });
  PORT = process.env.PORT;
} else if (process.env.NODE_ENV == "staging") {
  dotenv.config({ path: "./configStaging.env" });
  PORT = process.env.PORT;
} else {
  dotenv.config({ path: "./configDev.env" });
  PORT = process.env.PORT;
}

app.listen(PORT, (err) => {
  if (err) {
    console.log("server failed to start");
    process.env.exit();
  } else {
    console.log("Server is running on port:", PORT);
  }
});

////This is to be redirected to Error handling Middleware function, but I have disable it. More work will be done in the future in regards to This
// process.on("unhandledRejection", err => {
//   console.log(err.name, err.message)
//   console.log("UNHANDLED REJECTION!, Shouting down....")
//   server.close(() => {
//     process.exit(1);
//   })
// })

// console.log(x)

// process.on("uncaughtException", err => {
//   console.log("UNCAUGHT EXCEPTION, shouting down...")
//   console.log(err.name, err.message)
//   server.close(() => {
//     process.exit(1)
//   })
// })

// console.log(x)
