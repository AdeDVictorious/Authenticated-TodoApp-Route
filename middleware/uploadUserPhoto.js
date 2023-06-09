const multer = require("multer");

/////This save the image to the diskStorage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/user");
//   },
//   filename: (req, file, cb) => {
//     ////file Extension
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.userInfo._id}-${Date.now()}.${ext}`);
//   },
// });

/////While the code below will save it to the memory where it can be read as buffer
const multerStorage = multer.memoryStorage();

////This is the filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single("photo");

module.exports = uploadUserPhoto;
