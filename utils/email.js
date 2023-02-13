const nodemailer = require("nodemailer");
const AppError = require("./appError");

async function sendEmail(options) {
  // create transporter
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    logger: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  // define email options
  const mailOptions = {
    from: "Tot <terjeovgg@gmail.com>",
    to: options.to,
    subject: options.subject,
    message: options.message,
    // html:
  };

  // send email
  await transport.sendMail(mailOptions);
}

module.exports = sendEmail;
