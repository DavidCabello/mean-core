const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const keys = require('../utils/keys');

require('dotenv').config();
const userCtrl = { };

userCtrl.signup = async (req, res) => {
  try {
    if(req.user == 'existing') {
      res.json({message: 'existing'})
    } else if(req.user == 'undefined') {
      res.json({message: 'unknown'})
    } else {
      const user = {...req.body}
      delete user.password
      user.role = 'user'
      const created = await User.findOneAndUpdate({_id: req.user._id}, {$set: user}, {new: true});
      const token = jwt.sign(req.user.toJSON(), keys.secret);
      res.json({ 
        message: 'success',
        user: created,
        token
      });
    }
  } catch(err) {
    res.json(err.message);
  }
};

userCtrl.create = async (req, res) => {
  try {
    if(req.user == 'existing') {
      res.json({message: 'existing'})
    } else if(req.user == 'undefined') {
      res.json({message: 'unknown'})
    } else {
      const user = {...req.body}
      delete user.password
      const created = await User.findOneAndUpdate({_id: req.user._id}, {$set: user}, {new: true});
      res.json({ 
        message: 'success',
        user: created
      });
    }
  } catch(err) {
    res.json(err.message);
  }
};

userCtrl.login = async (req, res) => {
  try {
    if(req.user == 'invalid') {
      res.json({message: 'invalid'})
    } else {
      const user = await User.findOne({_id: req.user._id});
      const token = jwt.sign(req.user.toJSON(), keys.secret, {expiresIn: '1y'});
      res.json({
        message: 'success',
        user,
        token
      });
    }
  } catch (error) {
    res.json(error.message);    
  }
};

userCtrl.logged = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id});
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.all = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.one = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    res.json(user);
  } catch (error) {
    res.status(500).json(error);    
  }
};

userCtrl.logout = async (req, res) => {
  try {
    req.user = null;
    res.json('Logged out');
  } catch (error) {
    res.json(error);
  }
};

userCtrl.update = async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate({_id: req.body.id}, {$set: {...req.body}}, {new: true});
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.updatePassword = async (req, res) => {
  try {
    let user;
    if (req.query.encoded) {
      const decoded = await Buffer.from(req.query.encoded, 'base64').toString();
      const parsed = await JSON.parse(decoded);
      user = await User.findOne({_id: parsed._id});
    } else {
      user = await User.findOne({_id: req.query.id});
    }
    const newPassword = await user.hashPassword(req.body.password);
    const updated = await User.findOneAndUpdate({_id: user._id}, {$set: {password: newPassword}}, {new: true});
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.updatePasswordWithId = async (req, res) => {
  try {
    let newUser = await User.findOne({_id: req.body.id});
    const newPassword = await newUser.hashPassword(req.body.password);
    const updated = await User.findOneAndUpdate({_id: req.body.id}, {$set: {password: newPassword}}, {new: true});
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.delete = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({_id: req.params.id});
    res.json(deleted);
  } catch (error) {
    res.json(error);
  }
};

module.exports = userCtrl;