import { pool } from "../../../utils/database";
import jwtGenerator from "../../../utils/jwtGenerator";
import bcrypt from "bcrypt";

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      login(req, res);
      break;
    default:
      res.status(404).json({ err: "Please check your email" });
  }
}

const login = (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    const userQuery = `select * from users where email=?`;
    pool.query(userQuery, [email], async (err, data) => {
      if (err) {
        return res.status(500).json({ err: "Email or password invalid " });
      }
      if (data) {
        console.log(data[0].password);
        const matching = bcrypt
          .compare(password, data[0].password)
          .then(function (result) {
            console.log(result);
            return result;
          })
          .catch((err) => {
            return res.status(500).json({ err: "Email or password invalid" });
          });
        console.log("i am match", matching);
        if (matching) {
          token = jwtGenerator(email);
          return res.status(200).json({
            success: true,
            data: {
              name: data[0].name,
              email: data[0].email,
              role: data[0].role,
            },
            message: "login successfully",
            token,
          });
        } else {
          return res.status(500).json({
            success: false,
            err: "email or password invalid",
          });
        }
      }
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};
