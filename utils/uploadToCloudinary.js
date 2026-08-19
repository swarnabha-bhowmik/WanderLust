const {cloudinary} = require("../cloudConfig.js");
const streamifier = require('streamifier');

// NOTE: this is a plain async helper, NOT Express middleware -
// it must NOT be wrapped in wrapAsync (that wrapper expects a
// (req, res, next) signature and swallows the return value/errors).
const uploadToCloudinary = async (fileBuffer, req, file, params = {}) => {
  const folder = typeof params.folder === 'function'
    ? await params.folder(req, file)
    : params.folder;

  const public_id = typeof params.public_id === 'function'
    ? await params.public_id(req, file)
    : params.public_id;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;