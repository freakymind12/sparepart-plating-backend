const supplierModel = require("../models/supplierModel")

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

const newSupplier = async (req, res) => {
  try {
    await supplierModel.addSupplier(req.body)
    handleResponse(res, "Create new supplier successfully", 200, req.body);
  } catch (error) {
    handleError(res, error)
  }
}

const getSuppliers = async (req, res) => {
  try {
    const supplier = await supplierModel.getSuppliers()
    handleResponse(res, "Get all supplier successfully", 200, supplier);
  } catch (error) {
    handleError(res, error)
  }
}

const updateSupplier = async (req, res) => {
  try {
    await supplierModel.updateSupplier(req.params.id, req.body)
    handleResponse(res, "Update supplier succes", 200, req.body)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteSupplier = async (req, res) => {
  try {
    const data = await supplierModel.getSupplierById(req.params.id)
    if (data.length !== 0) {
      const deleted = await supplierModel.deleteSupplier(req.params.id);
      const message = deleted
        ? "Supplier deleted successfully"
        : "Failed to delete supplier";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Supplier not found", 404);
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  newSupplier,
  getSuppliers, 
  updateSupplier,
  deleteSupplier
}