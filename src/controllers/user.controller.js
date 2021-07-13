const User = require('../models/user.model');
const Agency = require('../models/agency.model');
const Invitation = require('../models/invitation.model');
const Role = require('../models/role.model');
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
      user.verified = false
      const created = await User.findOneAndUpdate({_id: req.user._id}, {$set: user}, {new: true});
      const token = jwt.sign(req.user.toJSON(), keys.secret);
      if(req.body.invitation) {
        await Invitation.findOneAndRemove({_id: req.body.invitation})
      }
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
      const user = await User.findOne({_id: req.user._id}, 'email name phone pro_expiration verified agency_id')
      if(!user.verified) {
        res.json({message: 'unverified'})
      } else {
        const token = jwt.sign(req.user.toJSON(), keys.secret, {expiresIn: '1y'});
        res.json({
          message: 'success',
          user,
          token
        });
      }
    }
  } catch (error) {
    res.json(error.message);    
  }
};

userCtrl.verify = async (req, res) => {
  try {
    let user;
    if (req.query.encoded) {
      const decoded = await Buffer.from(req.query.encoded, 'base64').toString();
      const parsed = await JSON.parse(decoded);
      user = await User.findOne({_id: parsed._id});
    } else {
      user = await User.findOne({_id: req.query.id});
    }
    const updated = await User.findOneAndUpdate({_id: user._id}, {$set: {verified: true}}, {new: true});
    updated ? res.json('success') : res.json('error')
  } catch (error) {
    res.json(error);
  }
};

userCtrl.logged = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id}, 'email name phone pro_expiration agency_id')
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
    const user = await User.findOne({_id: req.params.id}, 'email name phone pro_expiration agency_id')
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
    const user = {...req.body}
    if(req.user._id == user._id && req.user.email != user.email) {
      const exists = await User.findOne({email: user.email})
      if(exists) {
        res.json('existing')
        return
      }
      else user.verified = false
    }
    const updated = await User.findOneAndUpdate({_id: user._id}, {$set: user}, {new: true, fields: 'email name phone pro_expiration permissions_id _id'})
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.acceptInvitation = async (req, res) => {
  try {
    const user = {
      agency_id: req.body.agency_id,
      permissions_id: req.body.permissions_id
    }
    await User.findOneAndUpdate({_id: req.user._id}, {$set: user})
    await Invitation.findOneAndDelete({_id: req.body._id})
    const members = await User.countDocuments({agency_id: req.user.agency_id})
    if(members == 0) {
      await Agency.findOneAndRemove({_id: req.user.agency_id})
      await Role.deleteMany({agency_id: req.user.agency_id})
    }
    res.json('success');
  } catch (error) {
    res.json(error);
  }
}

userCtrl.removeAgency = async (req, res) => {
  try {
    const target = await User.findById(req.body.id)
    const adminRole = await Role.findOne({$and: [
      {agency_id: req.user.agency_id},
      {name: 'Admin'}
    ]})
    const admins = await User.find({$and: [
      {agency_id: req.user.agency_id},
      {permissions_id: adminRole._id}
    ]})
    const targetPermissions = String(target.permissions_id)
    const adminPermissions = String(adminRole._id)
    if(targetPermissions == adminPermissions && admins.length == 1) {
      res.json('invalid')
    } else {
      const permissions = await Role.findById(req.user.permissions_id)
      if(permissions && permissions.remove_agent) {
        await User.findOneAndUpdate({_id: req.body.id}, {$set: {agency_id: undefined}})
        res.json('success');
      } else res.json('forbidden')
    }
  } catch (error) {
    res.json(error);
  }
}

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
    const updated = await User.findOneAndUpdate({_id: user._id}, {$set: {password: newPassword}}, {new: true, fields: 'email name phone pro_expiration _id'})
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

userCtrl.updatePasswordWithId = async (req, res) => {
  try {
    let user = await User.findOne({_id: req.body.id});
    const valid = await user.isValidPassword(req.body.password, user)
    if (valid) {
      const password = await user.hashPassword(req.body.newPassword);
      const updated = await User.findOneAndUpdate({_id: req.body.id}, {$set: {password: password}}, {new: true, fields: 'email name phone pro_expiration _id'})
      res.json({message: 'success', user: updated})
    } else res.json({message: 'invalid'})
  } catch (error) {
    res.json(error);
  }
};

userCtrl.delete = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({_id: req.params.id})
    res.json(deleted);
  } catch (error) {
    res.json(error);
  }
};

module.exports = userCtrl;