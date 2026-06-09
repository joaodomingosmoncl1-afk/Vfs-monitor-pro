const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function sendOTPEmail(to, code) {
  await transporter.sendMail({
    from: `"VFS Monitor" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Seu código de acesso',
    html: `<h2>Código: <strong>${code}</strong></h2><p>Válido por 10 minutos.</p>`
  });
}
module.exports = { sendOTPEmail };
