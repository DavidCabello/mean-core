const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

require('dotenv').config();

AWS.config.update({
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  accessKeyId: process.env.AWS_ACCESSKEYID,
  region: 'us-east-1'
});
const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'golden-code-bucket',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: 'test metadata'});
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;