module.exports = (req, res) => {
  const products = require('../db.json').products;
  const skills = require('../db.json').skills;
  res.render('pages/index', { products, skills });
};
