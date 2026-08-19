const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const allowedFormats = ['png', 'jpeg', 'jpg'];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    if (allowedFormats.includes(ext)) 
    {
        cb(null, true);
    }
    else
    {
        req.flash("error", `Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`);
        cb(null, false);
    }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional, 5MB
});

module.exports = {cloudinary, upload};