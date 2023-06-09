const crypto = require("crypto");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require("validator");
const bcrypt = require("bcrypt");

//name, email , photo, password, password confirm
const userSchema = new mongoose.Schema(
  {
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
    photo: {
      type: String,
      default: "default.jpg",
    },
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
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //has the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //This delete the passwordConform field and it will not be saved in the database
  this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//// This Line of code did not work for me, this will work when the passwordConfirm is selected to false

// userSchema.method.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000);
  }
};

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(
    { resetToken },
    this.passwordResetToken,
    "I am here at rest token"
  );
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
