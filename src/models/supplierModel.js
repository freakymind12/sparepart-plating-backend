const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addSupplier = async (supplierData) => {
  const { supplier_name, location } = supplierData;
  await runQuery(
    "INSERT INTO supplier (supplier_id, supplier_name, location) VALUES ( uuid(), ?, ?) ",
    [supplier_name, location]
  );
  return true;
};

const updateSupplier = async (id, supplierData) => {
  const { supplier_name, location } = supplierData;
  await runQuery(
    "UPDATE supplier SET supplier_name = ?, location = ? where supplier_id  = ?",
    [supplier_name, location, id]
  );
  return true;
};

const getSuppliers = async () => {
  return await runQuery(
    `SELECT * from supplier`
  );
};

const getSupplierById = async (id) => {
  return await runQuery(`SELECT * from supplier where supplier_id = ?`, [id])
}

const deleteSupplier = async (id) => {
  await runQuery("DELETE FROM supplier WHERE supplier_id = ?", [id]);
  return true;
};

module.exports= {
  addSupplier,
  updateSupplier,
  getSuppliers,
  getSupplierById,
  deleteSupplier
}