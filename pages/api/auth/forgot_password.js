import { pool } from "../../../utils/database";
import ErrorHandler from "../../../utils/errorHandler";
import crypto from "crypto";
import sendEmail from "../../../utils/sendEmail";

export default async function handler(req, res) {
  try {
    const email = req.body.email;

    const userQuery = "select * from users where email=? ";
    pool.query(userQuery, [email], (err, data) => {
      if (err) {
        return res.status(500).json({ err: err });
      }
      if (data.length > 0) {
        const resetToken = crypto.randomBytes(20).toString("hex");

        const updateQuery =
          "update users set  resetPasswordExpire=now()+ interval 15 minute, resetPasswordToken=? where email=?";
        const host =
          process.env.NODE_ENV == "development" ? "localhost:3000" : "";
        const protocol =
          process.env.NODE_ENV == "development" ? "http" : "https";
        const resetPasswordUrl = `${protocol}://${host}/api/auth/reset_password/${resetToken}`;

        const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

        pool.query(updateQuery, [resetToken, email], (err, data) => {
          if (err) {
            return res.status(500).json({ err: err });
          }

          try {
            sendEmail({
              email,
              subject: `Your Password recovery`,
              message,
            });

            return res.status(200).json({
              success: true,
              message: `Email sent to ${email} successfully`,
            });
          } catch (error) {
            const updateFailedQuery =
              "update users set resetPasswordToken=?, resetPasswordExpire=? where email=?";
            pool.query(updateFailedQuery, [null, null, email]);
            return res.status(500).json({ err });
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Email is not registered ",
        });
      }
    });
  } catch (err) {
    res.status(500).json({ err: err });
  }
}
