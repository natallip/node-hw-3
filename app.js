const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const index = require('./routes/index');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'nodejs',
  key: 'key',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error');
});
const server = app.listen(process.env.PORT || 8080, function () {
  console.log('App app listening on port ' + server.address().port);
});
