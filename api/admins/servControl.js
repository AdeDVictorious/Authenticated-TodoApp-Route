let promisify = require("util");
const { Admin } = require("./model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const validator = require("validator");

class adminServices {
  async signupadmin(data) {
    try {
      // Check if email and password exist in the form
      const { role, name, email, photo, password, passwordConfirm } = data;

      if (!role || !name || !email || !photo || !password || !passwordConfirm) {
        return { status: 422, message: "Please fill all the required field" };
      }

      // Check if the password == confirm Password
      if (password != passwordConfirm) {
        return { status: 400, message: "Please confirm your password" };
      }

      // Check if email and password exist in the database
      const emailChecker = await Admin.find({ email: data.email });

      if (emailChecker.length > 0) {
        return { status: 404, message: "Email already exist" };
      }

      // create after all the checked is confirm
      await Admin.create(data);

      let token = await jwt.sign(
        { admindata: data },
        process.env.JWT_SECRET_CODE,
        {
          expiresIn: process.env.JWT_EXPIRES_IN_CODE,
        }
      );

      return {
        status: 201,
        token,
        message: "admin signup was successfully",
      };
    } catch (err) {
      console.log(err);
      return { status: 400, message: "admin signup failed to create" };
    }
  }

  async loginadmin(data) {
    try {
      // Check if email and password exist
      const { email, password } = data;
      if (!email || !password) {
        return { status: 422, message: "Please provide email and password" };
      }

      // 2). check if admin exist and password is correct
      const admin = await Admin.findOne({ email: data.email }).select(
        "+password"
      );

      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return { status: 400, message: "Incorrect email or password" };
      }

      const loginToken = await jwt.sign(
        { _id: admin._id },
        process.env.JWT_SECRET_CODE,
        {
          expiresIn: process.env.JWT_EXPIRES_IN_CODE,
        }
      );
      console.log(loginToken, " Am here at the login token");

      return { status: 200, loginToken, message: "Login was Successful" };
    } catch (err) {
      return {
        status: 400,
        message: "login failed, please use a valid email and password",
      };
    }
  }

  async getadminById(id) {
    try {
      let resp = await Admin.findById({ _id: id });
      return {
        status: 200,
        result: resp.length,
        message: "admin found successfully",
        admin: resp,
      };
    } catch (err) {
      return { status: 404, message: "admin not found" };
    }
  }

  async getAlladmin() {
    try {
      let resp = await Admin.find();
      console.log(resp);
      let dbCount = await Admin.estimatedDocumentCount();
      return {
        status: 200,
        dbCount: dbCount,
        message: "All admin found Successfully",
        admins: resp,
      };
    } catch (err) {
      return { status: 404, message: "Task failed to post" };
    }
  }

  async getadminByIdAndUpdate(id, data) {
    try {
      let resp = await Admin.findByIdAndUpdate({ _id: id }, data);
      let updateResp = await Admin.findById({ _id: id });
      return {
        status: 200,
        message: "admin's update was successfully using PATCH",
        admin: updateResp,
      };
    } catch (err) {
      return { status: 404, message: "admin update failed using PATCH" };
    }
  }

  async getByIdAndUpdate(id, data) {
    try {
      let resp = await Admin.findByIdAndUpdate({ _id: id }, data);
      let updateResp = await Admin.findById({ _id: id });
      return {
        status: 200,
        result: updateResp.length,
        message: "admin's update was successfully using PUT",
        admin: updateResp,
      };
    } catch (err) {
      return { status: 404, message: "admin update failed using PUT" };
    }
  }

  async getadminByIdAndDelete(id) {
    try {
      let resp = await Admin.findByIdAndDelete({ _id: id });
      return {
        status: 200,
        message: "admin was deleted successfully",
      };
    } catch (err) {
      return { status: 404, message: "admin failed to delete" };
    }
  }

  // //This code is dangerous as it delete all database record: Dont use
  // async getadminAndDeleteMany() {
  //   try {
  //     let resp = await Admin.deleteMany();
  //     return { status: 200, message: "All admins deleted Successfully" };
  //   } catch (err) {
  //     return { status: 404, message: "All admins not deleted" };
  //   }
  // }
}

module.exports = new adminServices();
