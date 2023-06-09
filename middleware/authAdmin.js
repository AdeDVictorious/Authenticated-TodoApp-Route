const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const authRequire = async (req, res, next) => {
  try {
    if (!req.headers.authorization || req.headers.authorization == "") {
      res.status(401).json({
        status: 401,
        message: "unautorized",
      });
    } else {
      let auth = req.headers.authorization.split(" ");
      if (auth.length != 2) {
        res.status(401).json({
          status: 401,
          message: "Access compromised",
        });
      } else {
        let bearer = auth[0];
        let token = auth[1];
        // console.log("1");

        let decode = await promisify(jwt.verify)(
          token,
          process.env.JWT_SECRET_CODE
        );

        if (!decode) {
          res.status(401).json({
            status: 401,
            message: "Unauthorised",
          });
        }

        // console.log(decode);
        req.userInfo = decode;

        next();
      }
    }
  } catch (err) {
    // console.log(err);
    res.status(401).json({
      status: 401,
      message: "Failed, an unknown error occurred please try again later",
    });
  }
};

module.exports = authRequire;
