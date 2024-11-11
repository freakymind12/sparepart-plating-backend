const uploadModel = require("../models/uploadsModel");
const fs = require("fs");
const path = require("path")

const uploadFile = async (req, res) => {
  try {
    // Cek apakah file tersedia
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const response = await uploadModel.addSparepartDrawing(req.file, req.body.sparepart_id);
    // File berhasil di-upload
    if (!response) {
      return res
        .status(500)
        .json({ error: "Failed to upload file on database" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({ error: "File upload failed" });
  }
};

const updateDrawingSparepart = async (req, res) => {
  try {

    console.log(req.body)
    // Ambil data gambar lama dari database
    const oldDrawingData = await uploadModel.getSparepartDrawingById(
      decodeURIComponent(req.params.id)
    );

    if (!oldDrawingData || oldDrawingData.length === 0) {
      const uploadNew = await uploadModel.addSparepartDrawing(
        req.file,
        decodeURIComponent(req.params.id)
      );
      if (!uploadNew) {
        return res
          .status(400)
          .json({ error: "Failed to upload file on database" });
      }
      return res.status(200).json({
        message: "File updated successfully",
      });
    }

    // Dapatkan nama file lama
    const oldDrawing = oldDrawingData[0].drawing_id;
    const oldFilePath = path.join(
      __dirname,
      "../uploads/sparepart-drawing",
      oldDrawing
    );

    // Update gambar baru ke database
    await uploadModel.updateSparepartDrawing(
      decodeURIComponent(req.params.id),
      req.file
    );

    // Hapus file lama dari direktori setelah berhasil update
    fs.unlink(oldFilePath, (err) => {
      if (err) {
        console.error("Failed to delete old drawing:", err);
      } 
    });

    // Kirim response berhasil
    return res.status(200).json({
      message: "File updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update drawing file on database",
    });
  }
};

// handle file upload error
const handleFileUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
  next();
};

module.exports = {
  uploadFile,
  handleFileUploadError,
  updateDrawingSparepart,
};
