import { executeQuery, pool } from "../../../utils/database";
import valid from "../../../utils/valid";
import bcrypt from "bcrypt";
import jwtGenerator from "../../../utils/jwtGenerator";

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      register(req, res);
      break;
    default:
      res.status(404).json({ err: "Please check your email" });
  }
}

const register = async (req, res) => {
  let token;
  try {
    const { email, name, password, cfPassword } = req.body;

    const errMssg = valid(name, email, password, cfPassword);

    // let hashedPassword = bcrypt.hash("fefrsaw", 10);

    if (errMssg) return res.status(400).json({ err: errMssg });
    try {
      const createTable =
        "create table if not exists users ( id int not null auto_increment, name varchar(255), email varchar(255) not null unique, password varchar(255), primary key(id), role varchar(20) default 'user', resetPasswordToken varchar(255), resetPasswordExpire Date  )";
      pool.query(createTable, (err, data) => {
        if (err) {
          return res.json({ err: "Something went wrong", err });
        }
        console.log(data);
      });
    } catch (err) {
      res.status(500).json({ err: err });
    }

    bcrypt.hash(password, 10, function (err, hash) {
      if (err) return res.status(401).json({ err: err });
      const userQuery =
        "insert into users (name, email, password) values (?,?,?)";
      pool.query(userQuery, [name, email, hash], (err, data) => {
        if (err) {
          return res.status(500).json({ err: err.sqlMessage });
        }
        if (data) {
          token = jwtGenerator(email);
          return res.status(200).json({
            success: true,
            data,
            message: "registered successfully",
            token,
          });
        }
      });
    });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
