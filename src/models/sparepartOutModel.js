const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addSparepartOut = async (SparepartOutData) => {
  const { sparepart_id, quantity_out, date_out, machine_id, id_user, note } =
    SparepartOutData;
  await runQuery(
    "INSERT INTO goodsout (sparepart_id, quantity_out, date_out, machine_id, id_user, note) VALUES ( ?, ?, ?, ?, ?, ?) ",
    [sparepart_id, quantity_out, date_out, machine_id, id_user, note]
  );
  return true;
};

const updateSparepartOut = async (id, SparepartOutData) => {
  const { sparepart_id, quantity_out, date_out, machine_id, note } =
    SparepartOutData;
  await runQuery(
    "UPDATE goodsout SET sparepart_id = ?, quantity_out = ?, date_out = ?, machine_id = ?, note = ? where goods_out_id  = ?",
    [sparepart_id, quantity_out, date_out, machine_id, note, id]
  );
  return true;
};

const getSparepartOut = async (filters) => {
  const baseQuery = `
    SELECT g.*, DATE_FORMAT(g.date_out, '%Y-%m-%d') AS date_out, s.name, u.username
    FROM goodsout AS g
    JOIN sparepart AS s ON g.sparepart_id = s.sparepart_id
    JOIN users AS u ON g.id_user = u.id_user
  `;

  const conditions = [
    filters.year && `YEAR(g.date_out) = ${filters.year}`,
    filters.month && `MONTH(g.date_out) = ${filters.month}`,
    filters.sparepart_id && `g.sparepart_id = '${filters.sparepart_id}'`,
    filters.machine_id && `g.machine_id = '${filters.machine_id}'`
  ].filter(Boolean); // Remove falsy values

  const query = `${baseQuery}${conditions.length ? ` WHERE ${conditions.join(" AND ")}` : ''} ORDER BY g.date_out DESC`;

  return await runQuery(query);
};

const getTotalSparepartOut = async (queryParams) => {
  const { category_id, year, month } = queryParams;
  return await runQuery(
    `
  SELECT 
	DATE_FORMAT(gout.date_out, '%Y-%m') as yearmonth,
    s.sparepart_id, 
    s.name AS sparepart_name, 
    gout.machine_id, 
    CAST(SUM(gout.quantity_out) AS UNSIGNED) AS used
  FROM 
      goodsout gout
  JOIN 
      sparepart s ON gout.sparepart_id = s.sparepart_id
  WHERE s.category_id = '${category_id}' AND YEAR(gout.date_out) = ? AND MONTH(gout.date_out) = ?
  GROUP BY 
      s.sparepart_id, s.name, gout.machine_id
  ORDER BY 
      s.name`,
    [year, month]
  );
};

const getSparepartOutById = async (id) => {
  return await runQuery(`SELECT * from goodsout where goods_out_id = ?`, [id]);
};

const deleteSparepartOut = async (id) => {
  await runQuery("DELETE FROM goodsout WHERE goods_out_id = ?", [id]);
  return true;
};

module.exports = {
  addSparepartOut,
  updateSparepartOut,
  getSparepartOut,
  getSparepartOutById,
  deleteSparepartOut,
  getTotalSparepartOut,
};
