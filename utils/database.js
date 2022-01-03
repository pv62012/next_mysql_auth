import { createPool } from "mysql";

// const connectDatabase = () => {
const {
  MYSQL_HOST,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;
const pool = createPool({
  host: MYSQL_HOST,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT,
});

pool.getConnection((err) => {
  if (err) {
    return console.log("error in connecting ", err);
  }
  console.log("Connected to MYSQL");
});
// };

const executeQuery = (query, arraParams) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(query, arraParams, (err, data) => {
        if (err) {
          // if (err.code == "ER_DUP_ENTRY")
          //   return res.status(500).json(err.sqlMessage);
          // res.status(500).json(err.sqlMessage);
          reject(err);
          return err;
        }
        return resolve(data);
        // if (data) return res.status(200).json(data);
      });
    } catch (err) {
      // console.log("try catch err", err);
      // res.status(500).json(err);
      return reject(err);
    }
  });
};
export { pool, executeQuery };
// export default connectDatabase;
