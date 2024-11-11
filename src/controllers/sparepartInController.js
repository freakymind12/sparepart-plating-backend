const sparepartInController = require("../models/sparepartInModel")

const handleResponse = (res, message, status = 200, data = null) => {
  if (data !== null) {
    res.status(status).json({ message, data });
  } else {
    res.status(status).json({ message });
  }
};

const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Server Error" });
};

const newSparepartIn = async (req, res) => {
  try {
    await sparepartInController.addSparepartIn(req.body)
    handleResponse(res, "Create new incoming successfully", 200, req.body);
  } catch (error) {
    handleError(res, error)
  }
}

const getSparepartIn = async (req, res) => {
  try {
    const sparepart = await sparepartInController.getSparepartIn()
    handleResponse(res, "Get all incoming sparepart successfully", 200, sparepart);
  } catch (error) {
    handleError(res, error)
  }
}

const updateSparepartIn = async (req, res) => {
  try {
    await sparepartInController.updateSparepartIn(req.params.id, req.body)
    handleResponse(res, "Update incoming sparepart succes", 200, req.body)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteSparepartIn = async (req, res) => {
  try {
    const data = await sparepartInController.getSparepartInById(req.params.id)
    if (data.length !== 0) {
      const deleted = await sparepartInController.deleteSparepartIn(req.params.id);
      const message = deleted
        ? "Sparepart incoming deleted successfully"
        : "Failed to delete sparepart";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Sparepart incoming not found", 404);
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  newSparepartIn,
  getSparepartIn, 
  updateSparepartIn,
  deleteSparepartIn
}