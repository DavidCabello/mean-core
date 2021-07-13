const Invitation = require('../models/invitation.model');
const User = require('../models/user.model');
const Role = require('../models/role.model');

const controller =  {};

controller.create = async (req, res) => {
    try {
        const object = await new Invitation(req.body);
        const created = await object.save();
        res.json(created);
    } catch (error) {
        res.json(error);
    }
};

controller.all = async (req, res) => {
    try {
        const all = await Invitation.find();
        res.json(all);
    } catch (error) {
        res.json(error);
    }
};

controller.one = async (req, res) => {
    try {
        const match = await Invitation.findById(req.params.id);
        res.json(match);
    } catch (error) {
        res.json(error);    
    }
};

controller.update = async (req, res) => {
    try {
        const object = {...req.body};
        const updated = await Invitation.findOneAndUpdate({_id: object._id}, {$set: object}, {new: true});
        res.json(updated);
    } catch (error) {
        res.json(error);
    }
};

controller.delete = async (req, res) => {
    try {
        const permissions = await Role.findById(req.user.permissions_id)
        if(permissions && permissions.invite_agent) {
            await Invitation.findOneAndRemove({_id: req.params.id})
            res.json('success');
        }
        else res.json('invalid')
    } catch (error) {
        res.json(error);
    }
};

controller.decode = async (req, res) => {
    try {
      let invitation
      if (req.query.encoded) {
        const decoded = await Buffer.from(req.query.encoded, 'base64').toString();
        const parsed = await JSON.parse(decoded);
        invitation = await Invitation.findOne({_id: parsed._id});
      } else {
        invitation = await Invitation.findOne({_id: req.query.id});
      }
      if(invitation) {
        const user = await User.findOne({email: invitation.email})
        invitation = {...invitation._doc, existing: user != undefined}
        res.json(invitation)
    } else res.json('expired')
    } catch (error) {
      res.json(error);
    }
};

controller.reject = async (req, res) => {
    try {
        await Invitation.findOneAndRemove({_id: req.body.id})
        res.json('success');
    } catch (error) {
        res.json(error);
    }
}

controller.agency = async (req, res) => {
    try {
        const invitations = await Invitation.find({agency_id: req.params.id}).sort('-createdAt')
        res.json(invitations);
    } catch (error) {
        res.json(error);
    }
}

module.exports = controller;