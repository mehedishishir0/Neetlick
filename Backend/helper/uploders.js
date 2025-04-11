const multer = require('multer');

const storage = multer.memoryStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload;