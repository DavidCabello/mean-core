const jwt = require('jsonwebtoken');
const keys = require('./keys');
const User = require('../models/user.model');

module.exports = {
  isAdmin: async (req, res, next) => {
    if (req.headers.token === undefined || req.headers.token === null) {
      res.status(403).end();
    } else {
      const decoded = await jwt.verify(req.headers.token, keys.secret);
      const user = await User.findOne({_id: decoded._id});
      if (user && user.role === 'admin') {
        req.user = user;
        next();
      }
    }
  },
  isLoggedIn: async (req, res, next) => {
    if (req.headers.token === undefined || req.headers.token === null) {
      res.status(403).end();
    } else {
      const decoded = await jwt.verify(req.headers.token, keys.secret);
      const user = await User.findOne({_id: decoded._id});
      if (user) {
        req.user = user;
        next();
      }
    }
  },
};
