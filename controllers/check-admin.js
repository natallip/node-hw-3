module.exports = (req, res) => {
  if (req.body.email === 'admin@gmail.com' && req.body.password === 'admin') {
    req.session.isAdmin = true;
    res.redirect('/admin');
  }
  res.render('pages/login', { msglogin: 'Вы не админ!' });
};
