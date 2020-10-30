const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const db = require('./database');
require('./utils/passport');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: '8o7OHO(&/G8o/OT68f76/%F5uI&fi7iF/F',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  },
  store: new MongoStore({
    mongooseConnection: db,
    ttl: 14 * 24 * 60 * 60,
  }),
}));

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

// routes
app.use('/api/users', require('./routes/users.route'));
app.use('/api/product', require('./routes/product.route'));
app.use('/api/mailer', require('./routes/mailer.route'));
app.use('/api/file', require('./routes/file.route'));

// start server
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(app.get('port'), () => {
  console.log('server on port ', app.get('port'));
});

module.exports = app;
