const Roles = require('../models/role.model');

const controller =  {};

controller.create = async (req, res) => {
    try {
        const exists = await Roles.findOne({$and: [
            {name: req.body.name},
            {agency_id: req.body.agency_id}
        ]})
        if(exists) res.json('invalid')
        else {
            const object = await new Roles(req.body);
            const created = await object.save();
            res.json(created);
        }
    } catch (error) {
        res.json(error);
    }
};

controller.all = async (req, res) => {
    try {
        const all = await Roles.find();
        res.json(all);
    } catch (error) {
        res.json(error);
    }
};

controller.one = async (req, res) => {
    try {
        const match = await Roles.findById(req.params.id);
        res.json(match);
    } catch (error) {
        res.json(error);    
    }
};

controller.update = async (req, res) => {
    try {
        const roles = [...req.body]
        for(let role of roles) {
            if(role.name == 'Admin') role.manage_roles = true
            await Roles.findOneAndUpdate({_id: role._id}, {$set: role}, {new: true});
        }
        res.json('success');
    } catch (error) {
        res.json(error);
    }
};

controller.delete = async (req, res) => {
    try {
        const role = Roles.findById(req.params.id)
        if(!role.default) {
            const deleted = await Roles.findOneAndDelete({_id: req.params.id});
            res.json(deleted);
        } else res.json('invalid')
    } catch (error) {
        res.json(error);
    }
};

controller.user = async (req, res) => {
    try {
        if(req.user.permissions_id) {
            const permissions = await Roles.findOne({_id: req.user.permissions_id})
            if(permissions) res.json(permissions)
            else res.json('not found')
        } else res.json('invalid')
    } catch (error) {
        res.json(error);
    }
}

module.exports = controller;