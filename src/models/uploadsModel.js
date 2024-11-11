const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addSparepartDrawing = async (file, id) => {
  const { filename } = file;
  await runQuery(
    `
    INSERT INTO drawing_sparepart (drawing_id, sparepart_id) VALUES ( ?, ? )
  `,
    [filename, id]
  );
  return true;
};

const updateSparepartDrawing = async (id, file) => {
  const { filename } = file;
  await runQuery(
    `UPDATE drawing_sparepart SET drawing_id = ? WHERE sparepart_id = ?`,
    [filename, id]
  );
};

const getSparepartDrawingById = async (id) => {
  return await runQuery(
    `SELECT * FROM drawing_sparepart WHERE sparepart_id = ?`,
    [id]
  );
};

module.exports = {
  addSparepartDrawing,
  getSparepartDrawingById,
  updateSparepartDrawing
};
