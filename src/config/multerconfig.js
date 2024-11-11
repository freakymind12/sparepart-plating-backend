// multerConfig.js
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

/**
 * Mengembalikan konfigurasi multer dengan direktori penyimpanan yang dinamis
 * @param {string} dirName - Nama direktori untuk menyimpan file yang di-upload
 * @param {string} filenamePrefix - Prefiks yang akan ditambahkan pada nama file
 * @returns {object} - Konfigurasi multer
 */

const generateShortUniqueId = () => {
  return crypto.randomBytes(6).toString("hex"); // Menghasilkan string 8 karakter heksadesimal
};

const getMulterConfig = (dirName, filenamePrefix = "") => {
  // Konfigurasi penyimpanan untuk multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../", dirName)); // Menggunakan direktori yang dinamis
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = generateShortUniqueId();
      const originalExt = path.extname(file.originalname).toLowerCase();
      cb(
        null,
        `${filenamePrefix}-${uniqueSuffix}${originalExt}`
      ); 
    },
  });

  // Konfigurasi multer
  return multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file 2 MB
    fileFilter: (req, file, cb) => {
      const fileTypes = /pdf/; // Jenis file yang diizinkan
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimeType && extname) {
        return cb(null, true);
      }
      cb(new Error("Only pdf file allowed")); // Jika file bukan gambar, tolak
    },
  });
};

module.exports = getMulterConfig;
