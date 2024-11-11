const sparepartOutController = require("../models/sparepartOutModel")

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

const groupingData = (data) => {
    const result = {};
    data.forEach(item => {
        const { sparepart_id, sparepart_name, machine_id, used, yearmonth } = item;
        if (!result[sparepart_id]) {
            result[sparepart_id] = {
                sparepart_id,
                sparepart_name,
                yearmonth,
                total_used: 0,
                used_history: []
            };
        }

        result[sparepart_id].used_history.push({
            machine_id,
            used,
            yearmonth
        });
        result[sparepart_id].total_used += used;
    });
    return Object.values(result);
}
// ======================================== //

const newSparepartOut = async (req, res) => {
  try {
    await sparepartOutController.addSparepartOut(req.body)
    handleResponse(res, "Create new outgoing successfully", 200, req.body);
  } catch (error) {
    handleError(res, error)
  }
}

const getSparepartOut = async (req, res) => {
  try {
    const filters = {
      year: req.query.year,
      month: req.query.month,
      sparepart_id: req.query.sparepart_id,
      machine_id: req.query.machine_id
    };
    
    const sparepart = await sparepartOutController.getSparepartOut(filters);
    handleResponse(res, "Get all outgoing sparepart successfully", 200, sparepart);
  } catch (error) {
    handleError(res, error);
  }
}

// Report penggunaan sparepart perbulan
const getReportSparepartOut = async (req, res) => {
  try {
    const data = await sparepartOutController.getTotalSparepartOut(req.query)
    const updatedData = groupingData(data)
    handleResponse(res, "Get Report sparepart successfully", 200, updatedData)
  } catch (error) {
    handleError(res, error)
  }
}

const updateSparepartOut = async (req, res) => {
  try {
    await sparepartOutController.updateSparepartOut(req.params.id, req.body)
    handleResponse(res, "Update outgoing sparepart succes", 200, req.body)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteSparepartOut = async (req, res) => {
  try {
    const data = await sparepartOutController.getSparepartOutById(req.params.id)
    if (data.length !== 0) {
      const deleted = await sparepartOutController.deleteSparepartOut(req.params.id);
      const message = deleted
        ? "Sparepart outgoing deleted successfully"
        : "Failed to delete sparepart outgoing";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Sparepart outgoing not found", 404);
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  newSparepartOut,
  getSparepartOut, 
  getReportSparepartOut,
  updateSparepartOut,
  deleteSparepartOut
}