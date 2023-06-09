const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// role, name, email, photo, password, password confirm
const adminSchema = new mongoose.Schema(
  {
    roles: {
      type: String,
      enum: ["customer support", "manager", "lead manager"],
      default: "customer support",
    },
    name: {
      type: String,
      required: [true, "Please tell us your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please tell us your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    photo: String,
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minilength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log(this.roles);
  //has the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //This delete the passwordConform field and it will not be saved in the databas
  this.passwordConfirm = undefined;
});

adminSchema.pre("remove", function (next) {
  if (this.roles === "customer support") return next();
  if (this.roles === "manager") return next();
  console.log(this.roles, "Hello from te schema");
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
