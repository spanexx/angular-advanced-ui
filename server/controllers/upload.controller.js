const s3 = require('../utils/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    key: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  })
});

exports.uploadFile = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      url: req.file.location,
      name: req.file.originalname,
      type: req.file.mimetype
    });
  }
];
