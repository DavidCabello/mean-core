const Notification = require('../models/notification.model');

const controller =  {};

controller.create = async (req, res) => {
    try {
        const object = await new Notification(req.body);
        const created = await object.save();
        res.json(created);
    } catch (error) {
        res.json(error);
    }
};

controller.all = async (req, res) => {
    try {
        const all = await Notification.find();
        res.json(all);
    } catch (error) {
        res.json(error);
    }
};

controller.one = async (req, res) => {
    try {
        const match = await Notification.findById(req.params.id);
        res.json(match);
    } catch (error) {
        res.json(error);    
    }
};

controller.update = async (req, res) => {
    try {
        const object = {...req.body};
        const updated = await Notification.findOneAndUpdate({_id: object._id}, {$set: object}, {new: true});
        res.json(updated);
    } catch (error) {
        res.json(error);
    }
};

controller.delete = async (req, res) => {
    try {
        const deleted = await Notification.findOneAndRemove({_id: req.params.id});
        res.json(deleted);
    } catch (error) {
        res.json(error);
    }
};

module.exports = controller;