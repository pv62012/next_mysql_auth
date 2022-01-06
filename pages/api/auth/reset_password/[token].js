import { executeQuery, pool } from "../../../../utils/database";
import crypto from "crypto";

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      resetPassword(req, res);
      break;
    default:
      res.status(404).json({ err: "Check your method" });
  }
};

export default handler;

const resetPassword = (req, res) => {
  //   var resettoken = req.query.token;

  //   const resettoken = crypto
  //     .createHash("sha256")
  //     .update(req.query.token)
  //     .digest("hex");
  const resettoken = req.query.token;
  const resetData = executeQuery(
    "select * from users where resetPasswordToken=? and resetPasswordExpire > now()",
    [resettoken]
  );
  console.log(req.query.token);
  resetData
    .then((result) => {
      console.log(
        "i am result",
        result[0].resetPasswordExpire.toLocaleString()
      );
      res.status(200).json({ message: result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
  //   console.log("reset data", resetData);
  //   res.status(200).json({ message: "password reset" });
};
