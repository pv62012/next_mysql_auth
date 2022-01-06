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
          reject(err);
        }
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
};
export { pool, executeQuery };
// export default connectDatabase;
