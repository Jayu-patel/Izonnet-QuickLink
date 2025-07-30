const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendAppointmentEmail = async (to, subject, html, pdfBuffer) => {
  const mailOptions = {
    from: `XYZ`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "appointment.pdf",
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAppointmentEmail };
