const path = require('path');
const { promisify } = require('util');
const multer = require('multer');

const getFolderForFiles = dirName => path.join(__dirname, `../public${dirName}`);

const pickStorage = (folderToUpload, useOriginalName = false) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getFolderForFiles(folderToUpload));
  },
  filename: (req, file, cb) => {
    const fileName = useOriginalName
      ? file.originalname
      : `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;

    cb(null, fileName);
  },
});

const uploadImage = async (req, res, next) => {
  const storage = pickStorage('/images/uploads');
  const upload = multer({ storage }).single('image');
  const uploadInPromise = promisify(upload);
  await uploadInPromise(req, res);
  return next();
};

module.exports = {
  uploadImage,
};
