const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "uploads");

// Verifica se o diretório de uploads existe, se não, cria-o
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/jpg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato inválido. Apenas arquivos JPEG, PNG, SVG e JPG são permitidos."
      )
    );
  }
};

const upload = multer({ storage: storageConfig, fileFilter: fileFilter });

module.exports = upload;
