const machineModel = require("../models/machineModel")

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

const newMachine = async (req, res) => {
  try {
    await machineModel.addMachine(req.body)
    handleResponse(res, "Create new machine successfully", 200, req.body);
  } catch (error) {
    handleError(res, error)
  }
}

const getMachines = async (req, res) => {
  try {
    const machine = await machineModel.getMachines()
    handleResponse(res, "Get all machine successfully", 200, machine);
  } catch (error) {
    handleError(res, error)
  }
}

const updateMachine = async (req, res) => {
  try {
    await machineModel.updateMachine(req.params.id, req.body)
    handleResponse(res, "Update machine succes", 200, req.body)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteMachine = async (req, res) => {
  try {
    const data = await machineModel.getMachineById(req.params.id)
    if (data.length !== 0) {
      const deleted = await machineModel.deleteMachine(req.params.id);
      const message = deleted
        ? "Machine deleted successfully"
        : "Failed to delete machine";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Machine not found", 404);
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  newMachine,
  getMachines, 
  updateMachine,
  deleteMachine
}