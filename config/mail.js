module.exports = {
  smtpConfig: {
    host: 'smtp.1and1.es',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }
};
