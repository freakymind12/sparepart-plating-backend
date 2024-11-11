const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addSparepart = async (sparepartData) => {
  const {
    sparepart_id,
    name,
    description,
    unit_price,
    safety_stock,
    reorder_point,
    category_id,
    id_user,
    supplier_id,
  } = sparepartData;
  await runQuery(
    "INSERT INTO sparepart (sparepart_id, name, description, unit_price, safety_stock, reorder_point, category_id, id_user, supplier_id) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?) ",
    [
      sparepart_id,
      name,
      description,
      unit_price,
      safety_stock,
      reorder_point,
      category_id,
      id_user,
      supplier_id,
    ]
  );
  return true;
};

const updateSparepart = async (id, sparepartData) => {
  const {
    sparepart_id,
    name,
    description,
    unit_price,
    safety_stock,
    reorder_point,
    category_id,
    supplier_id,
  } = sparepartData;
  await runQuery(
    "UPDATE sparepart SET sparepart_id = ?, name = ?, description = ?, unit_price = ?, safety_stock = ?, reorder_point = ?, category_id = ?, supplier_id = ? where sparepart_id  = ?",
    [
      sparepart_id,
      name,
      description,
      unit_price,
      safety_stock,
      reorder_point,
      category_id,
      supplier_id,
      id,
    ]
  );
  return true;
};

const getSpareparts = async (category_id) => {
  let query = `
  SELECT s.*, u.username, sup.supplier_name, ds.drawing_id, 
  COALESCE(gi.total_in, 0) - COALESCE(go.total_out, 0) AS actual_stock,
  DATE_FORMAT(CURDATE(), '%Y-%m-%d') as query_date
  FROM sparepart as s
  LEFT JOIN users as u ON s.id_user = u.id_user
  LEFT JOIN supplier as sup ON s.supplier_id = sup.supplier_id
  LEFT JOIN drawing_sparepart as ds on s.sparepart_id = ds.sparepart_id
  LEFT JOIN (
    SELECT sparepart_id, SUM(quantity_in) AS total_in
    FROM goodsin
    GROUP BY sparepart_id
  ) gi ON s.sparepart_id = gi.sparepart_id

  LEFT JOIN (
    SELECT sparepart_id, SUM(quantity_out) AS total_out
    FROM goodsout
    GROUP BY sparepart_id
  ) go ON s.sparepart_id = go.sparepart_id
  `;

  if (category_id) {
    query += ` WHERE s.category_id = '${category_id}'`;
  }

  query += `
    GROUP BY s.sparepart_id, s.name
    ORDER BY s.name
  `;

  const result = await runQuery(query);

  // Mengubah actual_stock menjadi number
  return result.map((sparepart) => ({
    ...sparepart,
    actual_stock: Number(sparepart.actual_stock), // atau parseFloat(sparepart.actual_stock)
  }));
};

const getOutOfStock = async () => {
  const result = await runQuery(
    `SELECT * FROM ( 
      SELECT s.*, u.username, sup.supplier_name, COALESCE(SUM(gin.quantity_in), 0) - COALESCE(SUM(gout.quantity_out), 0) AS actual_stock, DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS query_date 
      FROM sparepart AS s 
      LEFT JOIN users AS u ON s.id_user = u.id_user 
      LEFT JOIN supplier AS sup ON s.supplier_id = sup.supplier_id 
      LEFT JOIN goodsin AS gin ON s.sparepart_id = gin.sparepart_id 
      LEFT JOIN goodsout AS gout ON s.sparepart_id = gout.sparepart_id 
      GROUP BY s.sparepart_id, s.name ) 
      AS subquery 
      WHERE actual_stock <= reorder_point 
      ORDER BY name
    `
  );
  return result.map((sparepart) => ({
    ...sparepart,
    actual_stock: Number(sparepart.actual_stock), // atau parseFloat(sparepart.actual_stock)
  }));
};

const getSparepartById = async (id) => {
  return await runQuery(`SELECT * FROM sparepart where sparepart_id = ?`, [id]);
};

// Report 
const getYearlyReportSparepart = async (id, year) => {
  const result = await runQuery(
    `
    SELECT s.sparepart_id, s.name, YEAR(go.date_out) AS year, MONTH(go.date_out) AS month, SUM(go.quantity_out) AS total_used, s.unit_price
    FROM goodsout go
    JOIN sparepart s ON go.sparepart_id = s.sparepart_id
    WHERE YEAR(go.date_out) = ? AND go.sparepart_id = ?
    GROUP BY s.sparepart_id, s.name, YEAR(go.date_out), MONTH(go.date_out)
    `,
    [year, id]
  );

  if(result.length == 0){
    return []
  }

  const formattedData = {
    sparepart_id: result[0].sparepart_id,
    name: result[0].name,
    year: result[0].year,
    report: Array.from({ length: 12 }, (_, i) => {
      const foundData = result.find((item) => item.month === i + 1);
      return {
        month: i + 1,
        qty: foundData ? parseInt(foundData.total_used) : 0,
        price: foundData ? foundData.total_used * foundData.unit_price : 0,
      };
    }),
  };
  return formattedData;
};

const deleteSparepart = async (id) => {
  await runQuery("DELETE FROM sparepart WHERE sparepart_id = ?", [id]);
  return true;
};

module.exports = {
  addSparepart,
  updateSparepart,
  getSpareparts,
  getSparepartById,
  getOutOfStock,
  getYearlyReportSparepart,
  deleteSparepart,
};
