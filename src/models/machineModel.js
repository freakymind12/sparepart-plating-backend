const dbPool = require("../config/database");

const runQuery = async (query, params = []) => {
  const [result] = await dbPool.query(query, params);
  return result;
};

const addMachine = async (machineData) => {
  const { machine_id, machine_name } = machineData;
  await runQuery(
    "INSERT INTO machine (machine_id, machine_name) VALUES ( ?, ?) ",
    [machine_id, machine_name]
  );
  return true;
};

const updateMachine = async (id, machineData) => {
  const { machine_name } = machineData;
  await runQuery(
    "UPDATE machine SET machine_name = ? where machine_id  = ?",
    [machine_name, id]
  );
  return true;
};

const getMachines = async () => {
  return await runQuery(
    `SELECT * from machine`
  );
};

const getMachineById = async (id) => {
  return await runQuery(`SELECT * from machine where machine_id = ?`, [id])
}

const deleteMachine = async (id) => {
  await runQuery("DELETE FROM machine WHERE machine_id = ?", [id]);
  return true;
};

module.exports= {
  addMachine,
  updateMachine,
  deleteMachine,
  getMachines,
  getMachineById
}