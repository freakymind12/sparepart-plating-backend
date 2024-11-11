const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addSparepartIn = async (SparepartInData) => {
  const { sparepart_id, quantity_in, date_in, id_user } = SparepartInData;
  await runQuery(
    "INSERT INTO goodsin (sparepart_id, quantity_in, date_in, id_user) VALUES ( ?, ?, ?, ?) ",
    [sparepart_id, quantity_in, date_in, id_user]
  );
  return true;
};

const updateSparepartIn = async (id, SparepartInData) => {
  const { sparepart_id, quantity_in, date_in,  } = SparepartInData;
  await runQuery(
    "UPDATE goodsin SET sparepart_id = ?, quantity_in = ?, date_in = ?  where goods_in_id  = ?",
    [sparepart_id, quantity_in, date_in, id]
  );
  return true;
};

const getSparepartIn = async () => {
  return await runQuery(
    `SELECT i.*, DATE_FORMAT(i.date_in, '%Y-%m-%d') AS date_in, s.name, sup.supplier_name, u.username
    FROM goodsin as i
    JOIN sparepart as s ON i.sparepart_id = s.sparepart_id
    JOIN supplier as sup ON s.supplier_id = sup.supplier_id
    JOIN users as u ON i.id_user = u.id_user
    ORDER BY i.date_in DESC`
  );
};

const getSparepartInById = async (id) => {
  return await runQuery(
    `SELECT * from goodsin where goods_in_id = ?`, [id]
  );
};

const deleteSparepartIn = async (id) => {
  await runQuery("DELETE FROM goodsin WHERE goods_in_id = ?", [id]);
  return true;
};

module.exports= {
  addSparepartIn,
  updateSparepartIn,
  getSparepartIn,
  getSparepartInById,
  deleteSparepartIn
}