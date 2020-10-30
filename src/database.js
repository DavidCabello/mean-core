const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true } , (err, response) => {
  if (err) throw err;
  console.log('BD online');
});

mongoose.set('useCreateIndex', true);
module.exports = mongoose.connection;
