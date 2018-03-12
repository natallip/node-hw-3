const router = require('express').Router();
const base = '../controllers';

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/');
};

router.get('/', require(base + '/index'));
router.post('/', require(base + '/contact-me'));
router.get('/login', require(base + '/login'));
router.post('/login', require(base + '/check-admin'));
router.get('/admin', isAdmin, require(base + '/admin'));
router.post('/admin/upload', require(base + '/upload'));
router.post('/admin/skills', require(base + '/skills'));

module.exports = router;
