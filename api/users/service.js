let crypto = require("crypto");
let promisify = require("util");
const { User } = require("./model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const validator = require("validator");
const sendEmail = require("../../utils/email");
const { nextTick } = require("process");

class userServices {
  async signupUser(data) {
    try {
      // Check if email and password exist in the form
      const { name, email, photo, password, passwordConfirm } = data;

      if (!name || !email || !photo || !password || !passwordConfirm) {
        return { status: 422, message: "Please fill all the required field" };
      }

      // Check if the password == confirm Password
      if (password != passwordConfirm) {
        return { status: 400, message: "Please confirm your password" };
      }

      // Check if email and password exist in the database
      const emailChecker = await User.find({ email: data.email });

      if (emailChecker.length > 0) {
        return {
          status: 404,
          message: "email address already, kindly use another email address",
        };
      }

      // create after all the checked is confirm
      await User.create(data);

      let token = await jwt.sign({ userdata: data }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      //This functionlity is perform by the frontend
      // data.cookie("jwt", token, {
      //   expires: new Date(
      //     Date.now() + process.env.JWT_COOKIES_EXPRIRES_IN * 24 * 60 * 60 * 1000
      //   ),
      //   secure: true,
      //   // httpOnly: true,
      // });

      return {
        status: 201,
        message: "User signup was successfully",
        token,
      };
    } catch (err) {
      // console.log(err);
      return { status: 400, message: "User signup failed to create" };
    }
  }

  async loginUser(data) {
    try {
      // Check if email and password is filled in the form
      const { email, password } = data;
      if (!email || !password) {
        return { status: 422, message: "Please provide email and password" };
      }

      // 2). check if user exist and password is found in the database
      const user = await User.findOne({ email: data.email }).select(
        "+password"
      );

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return { status: 400, message: "Incorrect email or password" };
      }

      const loginToken = await jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );
      // console.log(loginToken, " Am here at the login token");

      return { status: 200, message: "Login was Successful", loginToken };
    } catch (err) {
      return {
        status: 400,
        message: "login failed, please use a valid email and password",
      };
    }
  }

  async PwdForget(data) {
    try {
      //check if email exist in the db
      let user = await User.findOne({ email: data.email });
      if (!user) {
        return {
          status: 404,
          message: "There is no user with this email address",
        };
      }
      //sent token and hash the token inside the db
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      //send the token to the email
      // const resetURL = `${
      //   data.protocol
      // }://${"host"}/api/v2/resetPassword/${resetToken}
      // }`;

      ///// To improve on this later. as I become more professional
      const resetURL = `http://127.0.0.1:5000/api/v2/resetPassword/${resetToken}`;

      const message = `Your password reset token is as follows:\n\n${resetURL}\n\n Click on the link, otherwise copy it into your browser. If you have not requested this email, then please ignore.`;

      await sendEmail({
        email: user.email,
        subject: "Your password reset token expires in 10 mins",
        message,
      });

      return {
        status: 200,
        message: "reset token sent to email",
      };
    } catch (err) {
      // console.log(err, "am here @ err");
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return { status: 500, message: "There was an error. Try again" };
    }
  }

  /// Need help on this to look into this later
  async PwdReset(params, data) {
    try {
      //Get user based on the token
      const hashedToken = crypto
        .createHash("sha256")
        .update(params)
        .digest("hex");

      // console.log(hashedToken, " Am here at hash Token");

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      // console.log(user, " Am here at user at reset password");

      // // if Token has not expire & there is user, set the new password
      if (!user) {
        return { status: 400, message: "Token has expired" };
      }

      user.password = data.password;
      user.passwordConfirm = data.passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      //log user in and send the JWT,
      const loginToken = await jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );
      console.log(loginToken, " Am here at the login token for password reset");

      return { status: 200, message: "Login was Successful", loginToken };
    } catch (err) {
      return {
        status: 400,
        message:
          "Something went wrong. Reset password failed, please try again",
      };
    }
  }

  async updatePassword(id, data) {
    try {
      //Get User from collection
      const user = await User.findById({ _id: id }).select("+password");

      // const currentPassword = data.currentPassword;

      // check if posted current password is correct
      if (!(await bcrypt.compare(data.currentPassword, user.password))) {
        return { status: 401, message: "Your current password is wrong" };
      }

      //if so, update password
      user.password = data.password;
      user.passwordConfirm = data.passwordConfirm;

      //log user in, send JWT
      const loginToken = await jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      await user.save();

      return { status: 200, message: "Login was Successful", loginToken };
    } catch (err) {
      return {
        status: 400,
        message: "login failed, please use a valid email and password",
      };
    }
  }

  ////// Users Personal Operations
  async Me(data) {
    try {
      console.log(data, "am here with data");
      let oneUser = await User.findById({ _id: data._id });

      // console.log(oneUser, "Am here at One User");
      return {
        status: 200,
        message: "profile found successfully",
        oneUser,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: "profile was not found successfully",
      };
    }
  }

  async updateMe(data) {
    try {
      console.log(data, "12345678");
      ///// Just Keep this  here
      // if (!data.name) {
      //   return {
      //     status: 400,
      //     message: "Please enter your name",
      //   };
      // }

      //////Get User from collection
      const user = await User.findByIdAndUpdate(
        { _id: data._id },
        {
          photo: data.filename,
        },
        data
      );

      const updateUser = await User.findById({ _id: data._id });

      console.log(user, updateUser, "12340000008");

      ////This line of code below will fail because the Schema validation process will not allow it to update or save
      // //if so, update password
      // user.name = data.name;
      // // user.email = data.email;

      return {
        status: 200,
        message: "Update of name was successfully",
        updateUser,
      };
    } catch (err) {
      // console.log(err, "00000000000");

      return {
        status: 400,
        message: "Update of name was not successfully",
      };
    }
  }

  async updatePwd(data) {
    try {
      console.log(data, "welcome 12");

      //if user POST password data
      if (!data.currentPassword || !data.password || !data.passwordConfirm) {
        return {
          status: 400,
          message:
            "Please enter your current password, the new password and passwordConfirm",
        };
      }

      //if user new password and passwordConfirm is correct
      if (data.password != data.passwordConfirm) {
        return {
          status: 400,
          message: "The new password and passwordConfirm is not correct",
        };
      }

      /////Check if the current password is correct
      // check if user exist and password is found in the database
      const user = await User.findOne({
        _id: data._id,
      }).select("+password");

      if (!(await bcrypt.compare(data.currentPassword, user.password))) {
        return { status: 400, message: "Current Password is not correct" };
      }

      //if so, update password
      user.password = data.password;
      user.passwordConfirm = data.passwordConfirm;

      const updatedPwd = await user.save();

      return {
        status: 200,
        message: "Your password update was successful",
        updatedPwd,
      };
    } catch (err) {
      // console.log(err, "This is the error");
      return {
        status: 400,
        message: "There is an error.Please try again later",
      };
    }
  }

  async deleteMe(id) {
    try {
      let deleteUser = await User.findByIdAndUpdate(
        { _id: id },
        { active: false }
      );

      return { status: 204, message: "delete was success" };
    } catch (err) {
      // console.log(err);
      return { status: 404, message: "Error deleting Users" };
    }
  }

  async getUserById(id) {
    try {
      let resp = await User.findById({ _id: id });

      return {
        status: 200,
        result: resp.length,
        message: "User found successfully",
        user: resp,
      };
    } catch (err) {
      // console.log(err);
      return { status: 400, message: "Users not found with the ID supplied" };
    }
  }

  /////This route is restricted to Admin Only
  ////----- Original Get All Users Route, I can still improve this block of code to a better format ----////////
  async getAllUser(data) {
    try {
      ////Build Query
      //1.) Filtering
      let queryObj = { ...data };

      // console.log(queryObj, queryObj.page, "Am here at Query Obj");

      // ////This block of code did not work well for me.
      // const excludedfields = ["page", "sort", "limit", "field"];
      // excludedfields.forEach((el) => delete queryObj[el]);

      //2.) Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      // console.log(queryStr, "Am here at queryStr");

      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      // console.log(JSON.parse(queryStr), " Am here 2");

      let query = await User.find(JSON.parse(queryStr));

      //3.) sorting
      if (query.length > 0) {
        query = query.sort(function (a, b) {
          return b.email - a.email;
        });
      }

      // 4.) Pagination
      if (queryObj.page) {
        let page = queryObj.page * 1 || 0;
        let limit = 10;
        let count = await User.count();
        let totalpage = count / limit;

        const skip = (page - 1) * limit;

        query = await User.find().skip(skip).limit(limit);

        // console.log(count, skip, page, limit, totalpage, " Am here at skip");

        ////6.)  If Requested Page is Greater than > Pagination Page

        if (query) {
          let dbCount = await User.count();
          if (skip > dbCount) {
            return { status: 404, message: "Page does not exit" };
          }
        }
      }

      //// EXECUTE Query

      const resp = await query;
      // console.log(resp, "Am here at resp");
      let dbCount = await User.estimatedDocumentCount();

      //SEND RESPONSE
      return {
        status: 200,
        dbCount,
        result: resp.length,
        message: "All User found Successfully",
        resp,
      };
    } catch (err) {
      // console.log(err, "Am here at the error in Get All Users");
      return {
        status: 404,
        message: "Erorr fetching using user/users from the database",
      };
    }
  }

  // //// Get All Users Route with NPM Mongoose-Pagination-v2. It does only get all and automatic paginate the querys, but cannot do sorting
  // async getAllUser(data) {
  //   try {
  //     //1.) Filtering
  //     let queryObj = { ...data };

  //     let query = await User.find(queryObj);

  //     if (query) {
  //       const options = {
  //         page: queryObj.page * 1 || 0, // The current page number
  //         limit: 8,
  //         // The number of items per page
  //         /// ... Additional options if needed ...
  //       };

  //       query = await User.paginate({}, options, function (err, result) {
  //         if (err) {
  //           console.log(err, "Am here at err");
  //           return { message: "Bad Request" };
  //         }

  //         // Access the paginated results
  //         const { docs, total, limit, page, totalPages } = result;

  //         if (page > totalPages) {
  //           return {
  //             message: " you have exhausted the available page ",
  //           };
  //         }
  //         console.log(docs, "Am here at docs"); // The array of documents for the current page
  //         console.log(total, "Am here at total"); // The total number of documents
  //         console.log(limit, "Am here at limit"); // The limit of items per page
  //         console.log(page, "Am here at page"); // The current page number
  //         console.log(totalPages, "Am here at totalpages"); // The total number of pages
  //         return docs;
  //       });
  //     }

  //     //// EXECUTE Query
  //     const resp = await query;
  //     console.log(resp, "Am here at resp");

  //     let dbCount = await User.estimatedDocumentCount();

  //     //SEND RESPONSE
  //     return {
  //       status: 200,
  //       dbCount,
  //       result: resp.length,
  //       message: "All User found Successfully",
  //       users: resp,
  //     };
  //   } catch (err) {
  // console.log(err)
  // return {
  //       status: 400,
  //       message: "All User  was not found",
  // }
  // }

  async getUserByIdAndUpdate(id, data) {
    try {
      let resp = await User.findByIdAndUpdate({ _id: id }, data);
      let updateResp = await User.findById({ _id: id });

      return {
        status: 200,
        message: "User's update was successfully using PATCH",
        user: updateResp,
      };
    } catch (err) {
      return { status: 404, message: "User update failed using PATCH" };
    }
  }

  async getUserByIdAndDelete(id) {
    try {
      let resp = await User.findByIdAndDelete({ _id: id });
      return {
        status: 200,
        message: "User was deleted successfully",
      };
    } catch (err) {
      return { status: 404, message: "User failed to delete" };
    }
  }

  //// This code is for updating using PUT, but the PATCH method of updating will do the same function as this.

  // async getByIdAndUpdate(id, data) {
  //   try {
  //     let resp = await User.findByIdAndUpdate({ _id: id }, data);
  //     let updateResp = await User.findById({ _id: id });
  //     return {
  //       status: 200,
  //       result: updateResp.length,
  //       message: "User's update was successfully using PUT",
  //       user: updateResp,
  //     };
  //   } catch (err) {
  //     return { status: 404, message: "User update failed using PUT" };
  //   }
  // }

  // //This code is dangerous as it delete all database record: Dont use
  // async getUserAndDeleteMany() {
  //   try {
  //     let resp = await User.deleteMany();
  //     return { status: 200, message: "All Users deleted Successfully" };
  //   } catch (err) {
  //     return { status: 404, message: "All Users not deleted" };
  //   }
  // }
}

module.exports = new userServices();
