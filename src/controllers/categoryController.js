const categoryModel = require("../models/categoryModel")

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

const newCategory = async (req, res) => {
  try {
    await categoryModel.addCategory(req.body)
    handleResponse(res, "Create new category successfully", 200, req.body);
  } catch (error) {
    handleError(res, error)
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getCategorys()
    handleResponse(res, "Get all categories successfully", 200, categories);
  } catch (error) {
    handleError(res, error)
  }
}

const updateCategory = async (req, res) => {
  try {
    await categoryModel.updateCategory(req.params.id, req.body)
    handleResponse(res, "Update category succes", 200, req.body)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteCategory = async (req, res) => {
  try {
    const data = await categoryModel.getCategoryById(req.params.id)
    if (data.length !== 0) {
      const deleted = await categoryModel.deleteCategory(req.params.id);
      const message = deleted
        ? "Category deleted successfully"
        : "Failed to delete category";
      handleResponse(res, message, 200, data[0]);
    } else {
      handleResponse(res, "Category not found", 404);
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = {
  newCategory,
  getCategories, 
  updateCategory,
  deleteCategory
}