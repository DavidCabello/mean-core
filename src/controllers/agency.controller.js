const Agency = require('../models/agency.model');
const User = require('../models/user.model');
const Invitation = require('../models/invitation.model');
const Permissions = require('../models/role.model');

const controller =  {};

controller.create = async (req, res) => {
    try {
        const object = await new Agency(req.body);
        const created = await object.save();
        const admin = await new Permissions({
            agency_id: created._id,
            name: 'Admin',
            default: true,
            edit_properties: true,
            delete_properties: true,
            invite_agent: true,
            remove_agent: true,
            manage_roles: true,
            agency_stats: true,
            agency_activity: true,
            agency_info: true,
        })
        const role = await admin.save()
        const agent = await new Permissions({
            agency_id: created._id,
            name: 'Agente',
            default: true
        })
        await agent.save()
        await User.findOneAndUpdate({_id: req.user._id}, {$set: {agency_id: created._id, permissions_id: role._id}})
        res.json('success');
    } catch (error) {
        res.json(error);
    }
};

controller.all = async (req, res) => {
    try {
        const all = await Agency.find();
        res.json(all);
    } catch (error) {
        res.json(error);
    }
};

controller.one = async (req, res) => {
    try {
        const match = await Agency.findById(req.params.id);
        res.json(match);
    } catch (error) {
        res.json(error);    
    }
};

controller.user = async (req, res) => {
    try {
        const agency = await Agency.findById(req.user.agency_id)
        if(!agency) res.json('invalid')
        else {
            const agents = await User.find({agency_id: agency._id}, 'name email phone permissions_id pro_expiration')
            const pending = await Invitation.find({agency_id: agency._id})
            const roles = await Permissions.find({agency_id: agency._id})
            res.json({agency, agents, pending, roles})
        }
    } catch (error) {
        res.json(error);
    }
}

controller.update = async (req, res) => {
    try {
        const permissions = await Permissions.findById(req.user.permissions_id)
        if(permissions && permissions.agency_info) {
            const object = {...req.body};
            const updated = await Agency.findOneAndUpdate({_id: object._id}, {$set: object}, {new: true});
            res.json(updated);
        } else res.json('invalid')
    } catch (error) {
        res.json(error);
    }
};

controller.delete = async (req, res) => {
    try {
        
        const deleted = await Agency.findOneAndRemove({_id: req.params.id});
        res.json(deleted);
    } catch (error) {
        res.json(error);
    }
};

module.exports = controller;