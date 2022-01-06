import { createTransport } from "nodemailer";

const sendEmail = async (option) => {
  // console.log(process.env.SMPT_PASSWORD, process.env.SMPT_EMAIL);
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    sevice: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_EMAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.SMPT_EMAIL,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(mailOption);
};

export default sendEmail;
