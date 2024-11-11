const sparepartController = require("../models/sparepartModel");

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

const newSparepart = async (req, res) => {
  try {
    await sparepartController.addSparepart(req.body);
    handleResponse(res, "Create new sparepart successfully", 200, req.body);
  } catch (error) {
    handleError(res, error);
  }
};

const getSpareparts = async (req, res) => {
  try {
    const { category_id } = req.query;
    const spareparts = await sparepartController.getSpareparts(category_id);
    const modifiedSpareparts = spareparts.map(sparepart => {
      return {
        ...sparepart,
        drawing : sparepart.drawing_id ? `http://${process.env.HOST}:${process.env.PORT}/uploads/sparepart-drawing/${sparepart.drawing_id}` : null
      };
    });
    handleResponse(res, "Get all sparepart successfully", 200, modifiedSpareparts);
  } catch (error) {
    handleError(res, error);
  }
};

const getYearlyReportSparepart = async (req, res) => {
  try {
    const { sparepart_id, year } = req.query;
    console.log(sparepart_id)
    if (!sparepart_id || !year) {
      return handleResponse(res, "sparepart_id and year are required", 400);
    }

    const data = await sparepartController.getYearlyReportSparepart(
      sparepart_id,
      year
    );

    handleResponse(res, "Success", 200, data);
  } catch (error) {
    handleError(res, error);
  }
};

const getOutOfStock = async (req, res) => {
  try {
    const sparepart = await sparepartController.getOutOfStock();
    handleResponse(res, "Success", 200, sparepart);
  } catch (error) {
    handleError(res, error);
  }
};

const updateSparepart = async (req, res) => {
  try {
    await sparepartController.updateSparepart(
      decodeURIComponent(req.params.id),
      req.body
    );
    handleResponse(res, "Update sparepart succes", 200, req.body);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteSparepart = async (req, res) => {
  try {
    const data = await sparepartController.getSparepartById(req.params.id);
    if (data.length !== 0) {
      const deleted = await sparepartController.deleteSparepart(req.params.id);
      const message = deleted
        ? "Sparepart deleted successfully"
        : "Failed to delete sparepart";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Sparepart not found", 404);
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  newSparepart,
  getSpareparts,
  getOutOfStock,
  getYearlyReportSparepart,
  updateSparepart,
  deleteSparepart,
};
