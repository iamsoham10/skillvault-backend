const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image file'), false);
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});


const uploadToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'skillVault' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // res.status(200).json({ success: true, message: 'Image uploaded successfully', imageUrl: result.secure_url });
    return result;
  } catch (err) {
    throw new Error("Image upload failed");
  }
};

module.exports = { upload, uploadToCloudinary };