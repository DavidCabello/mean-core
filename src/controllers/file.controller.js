const upload = require('../utils/file-upload');
const singleUpload = upload.single('file');
const fileCtrl = { };

fileCtrl.uploadFile = function(req, res) {
  singleUpload(req, res, function(err) {
    if (err) throw err;
    return res.json(req.file.location);
  });
};

module.exports = fileCtrl;