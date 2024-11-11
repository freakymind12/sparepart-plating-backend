const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addCategory = async (categoryData) => {
  const { category_id, description } = categoryData;
  await runQuery(
    "INSERT INTO category (category_id, description) VALUES ( ?, ?) ",
    [category_id, description]
  );
  return true;
};

const updateCategory = async (id, categoryData) => {
  const { category_id, description } = categoryData;
  await runQuery(
    "UPDATE category SET category_id = ?, description = ? where category_id  = ?",
    [category_id, description, id]
  );
  return true;
};

const getCategorys = async () => {
  return await runQuery(
    `SELECT * from category`
  );
};

const deleteCategory = async (id) => {
  await runQuery("DELETE FROM category WHERE category_id = ?", [id]);
  return true;
};

const getCategoryById = async(id) => {
  return await runQuery("SELECT * from category where category_id = ?", [id])
}

module.exports= {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategorys,
  getCategoryById
}