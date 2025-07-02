const PDFDocument = require("pdfkit");

const generateAppointmentPDF = (appointment) => {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(20).text("Appointment Receipt", { align: "center" }).moveDown();
  doc.fontSize(14).text(`Patient Name: ${appointment.name}`);
  doc.text(`Doctor: ${appointment.doctorName}`);
  doc.text(`Date: ${appointment.date}`);
  doc.text(`Time: ${appointment.time}`);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
};

module.exports = { generateAppointmentPDF };
