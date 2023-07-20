const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  endpoint: "http://127.0.0.1:4566",
  s3ForcePathStyle: true,
});

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "al-hidayah-bucket",
//     acl: "public-read",
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString()); // Set the file name to be a timestamp
//     },
//   }),
// });

const upload = multer({
  storage: multer.memoryStorage()
});

module.exports = { upload, s3 };
