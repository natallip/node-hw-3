module.exports = (req, res) => {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('db.json');
  const db = low(adapter);
  const {age, concerts, cities, years} = req.body;
  if (!age || !concerts || !cities || !years) {
    return res.render('pages/admin', { msgskill: 'Заполните все поля!' });
  }
  if (!db.get('skills').value()) {
    db.defaults({ skills: [] }).write();
    db.get('skills')
      .push({ number: age, text: 'Возраст начала занятий на скрипке' })
      .push({ number: concerts, text: 'Концертов отыграл' })
      .push({ number: cities, text: 'Максимальное число городов в туре' })
      .push({ number: years, text: 'Лет на сцене в качестве скрипача' })
      .write();
  }
  const arrOfNumbers = [];
  Object.keys(req.body).map((key) => {
    let value = req.body[key];
    arrOfNumbers.push(value);
  });
  db._.mixin({
    upNumber: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = arrOfNumbers[i];
      }
      return array;
    }
  });

  db.get('skills')
    .upNumber()
    .write();
  res.render('pages/admin', { msgskill: 'Данные успешно изменены' });
};
