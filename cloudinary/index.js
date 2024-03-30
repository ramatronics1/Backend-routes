const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dsbgau1rl', 
  api_key: '926717186574768', 
  api_secret: 'vo0gRpO8PkYiPQvx5kT5_k5Qfng' 
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campuseats',
    allowed_formats: ['jpeg', 'png', 'jpg'] 
  }
});

module.exports = {cloudinary, storage };
