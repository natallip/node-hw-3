const nodemailer = require('nodemailer');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const config = require('../config.json');

module.exports = (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.json({ msgSendMail: 'Заполните все поля!', status: 'Error' });
  }
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: `Message from: ${name} <${email}>\n ${message}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.json({ msgSendMail: `При отправке письма произошла ошибка!: ${error}`, status: 'Error' });
    }
    if (!db.get('emails').value()) {
      db.defaults({ emails: [] }).write();
    }
    db.get('emails')
      .push({ email: req.body.email, name: req.body.name, message: req.body.message })
      .write();
    res.json({ msgSendMail: 'Сообщение отправлено!', status: 'OK' });
  });
};
