const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const keys = require('../utils/keys');

require('dotenv').config();
const userCtrl = { };

userCtrl.registerUser = async (req, res) => {
  try {
    const fullUser = {
      name: req.body.name,
      lastname: req.body.lastname,
      role: req.body.role,
      phone: req.body.phone
    };
    const user = await User.findOneAndUpdate({_id: req.user._id}, {$set: fullUser}, {new: true}).select('name lastname phone role email _id createdAt');
    const token = jwt.sign(req.user.toJSON(), keys.secret);
    res.json({ 
      message: 'Signup successful',
      user: user,
      token
    });
  } catch(err) {
    res.json(err.message);
  }
};

userCtrl.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id}).select('name lastname phone role email _id createdAt');
    const token = jwt.sign(req.user.toJSON(), keys.secret, {expiresIn: '1y'});
    res.json({
      message: 'Logged In',
      user,
      token
    });
  } catch (error) {
    res.json(error.message);    
  }
};

userCtrl.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id});
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.getOneUser = async (req, res) => {
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
    res.json('User logged out');
  } catch (error) {
    res.json(error);
  }
};

userCtrl.updateUser = async (req, res) => {
  try {
    const user = {
      id: req.body.id,
      name: req.body.name,
      lastname: req.body.lastname
    };
    const updated = await User.findOneAndUpdate({_id: req.params.id}, {$set: user}, {new: true});
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

userCtrl.updatePasswordWithID = async (req, res) => {
  try {
    let newUser = await User.findOne({_id: req.params.id});
    const newPassword = await newUser.hashPassword(req.body.password);
    const updated = await User.findOneAndUpdate({_id: req.params.id}, {$set: {password: newPassword}}, {new: true});
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.deleteUser = async (req, res) => {
  try {
    User.findOneAndDelete({_id: req.params.id}, async user => {
      if(user.role === 'inversion'){
        await Inversionista.findOneAndDelete({userID: req.params.id});
      }
    });
    res.json(`Usuario ${req.params.id} borrado`);
  } catch (error) {
    res.json(error);
  }
};

module.exports = userCtrl;