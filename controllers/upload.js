module.exports = (req, res) => {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('db.json');
  const db = low(adapter);
  const formidable = require('formidable');
  const fs = require('fs');
  const path = require('path');
  const form = new formidable.IncomingForm();
  const upload = path.join('public', 'assets', 'upload');
  let fileName;
  if (!fs.existsSync(upload)) {
    fs.mkdir(upload);
  }
  form.uploadDir = path.join(process.cwd(), upload);
  form.parse(req, (err, fields, files) => {
    if (err) return next(err);
    if (!fields.name || !fields.price || files.photo.size === 0) {
      fs.unlink(files.photo.path);
      return res.render('pages/admin', { msgfile: 'Заполните все поля!' });
    }
    fileName = path.join(upload, files.photo.name);
    console.log(files.photo.path);
    fs.rename(files.photo.path, fileName, (err) => {
      if (err) {
        console.error(err);
        fs.unlink(fileName);
      }
    });
    fileName = path.join('assets', 'upload', files.photo.name);
    if (!db.get('products').value()) {
      db.defaults({ products: [] }).write();
    }
    db.get('products')
      .push({ name: fields.name, price: fields.price, src: fileName })
      .write();
    return res.render('pages/admin', { msgfile: 'Картинка успешно загружена' });
  });
};
