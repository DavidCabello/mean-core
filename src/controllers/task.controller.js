const Task = require('../models/task.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

const cron = require('node-cron');
const moment = require('moment');

//mailer
const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();
const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET
);
oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();
const baseUrl = 'http://localhost:4200'

const controller =  {};


controller.create = async (req, res) => {
    try {
        const object = await new Task(req.body);
        const created = await object.save();
        if(created.reminder) setReminder(created)
        res.json(created);
    } catch (error) {
        res.json(error);
    }
};

const setReminder = (task) => {
    // const date = new Date(task.notify)
    const date = new Date(task.date)
    date.setMonth(date.getMonth() + 1)
    if(task.notify.unit == 'week') date.setDate(date.getDate() - (task.notify.quantity * 7))
    else if(task.notify.unit == 'day') date.setDate(date.getDate() - task.notify.quantity)
    else if(task.notify.unit == 'hour') date.setHours(date.getHours() - task.notify.quantity)
    else date.setMinutes(date.getMinutes() - task.notify.quantity)
    const reminder = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} *`
    const notify = cron.schedule(reminder, async () => {
        const exists = await Task.findById(task._id)
        if (!exists ||
            !exists.reminder ||
            exists.notify.unit != task.notify.unit ||
            exists.notify.quantity != task.notify.quantity)
            return
        if(exists.notify_target == 'vilcom') {
            const notify = await new Notification({
                user_id: exists.user_id,
                type: 'task',
                task_id: exists._id
            })
            await notify.save()
        } else emailReminder(exists)
        notify.destroy()
    }, {timezone: 'America/Mexico_City'})
}

const emailReminder = async (task) => {
    try {
        const user = await User.findById(task.user_id)
        moment.locale('es')
        const date = moment(task.date).calendar()
        const smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'contacto.goldensub@gmail.com', 
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        smtpTransport.sendMail({
            from: 'noreply@goldensub.com',
            to: user.email,
            subject: `Recordatorio: ${task.title} - Vilcom`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>Forget password</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        padding-right: 10%;
                        padding-left: 10%;
                    }
                    h1 {color: #1F5A76;}
                    small {
                        color: #1F5A76;
                        background: #ECF3F9;
                        padding: 5px 15px;
                        border-radius: 20px;
                    }
                    p {color: #1F5A76;}
                    a {
                        display: inline-block;
                        padding: 0.3rem 1.6rem;
                        text-decoration: none;
                        color: #1F5A76 !important;
                        border: 1px solid #1F5A76;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>${task.title}</h1>
                    <small>${date.charAt(0).toUpperCase() + date.slice(1)}</small>
                    <p>${task.description ? task.description : 'Sin detalles adicionales'}</p>
                    <div style="text-align: center"><a href="${baseUrl}">Ver en Vilcom</a></div>
                </div>
            </body>
            </html>
            `
        },(err, success) => {
            if(success){
                console.log('message sent')
            } else if (err){
                console.log('error:', err)
            }
        });
    } catch (error) {
        console.log('error:', error)
    }
}

controller.all = async (req, res) => {
    try {
        const all = await Task.find();
        res.json(all);
    } catch (error) {
        res.json(error);
    }
};

controller.one = async (req, res) => {
    try {
        const match = await Task.findById(req.params.id);
        res.json(match);
    } catch (error) {
        res.json(error);    
    }
};

controller.update = async (req, res) => {
    try {
        const object = {...req.body};
        const prev = await Task.findById(object._id)
        const updated = await Task.findOneAndUpdate({_id: object._id}, {$set: object}, {new: true});
        if  (updated.reminder &&
            (prev.notify.unit != updated.notify.unit ||
            prev.notify.quantity != updated.notify.quantity))
            setReminder(updated)
        res.json(updated);
    } catch (error) {
        res.json(error);
    }
};

controller.delete = async (req, res) => {
    try {
        const deleted = await Task.findOneAndRemove({_id: req.params.id});
        res.json(deleted);
    } catch (error) {
        res.json(error);
    }
};

controller.client = async (req, res) => {
    try {
        const tasks = await Task.find({$and: [
            {user_id: req.user._id},
            {client_id: req.params.id},
            {done: false},
            {canceled: false}
        ]}).sort('-date')
        res.json(tasks);
    } catch (error) {
        res.json(error);
    }
}

controller.todo = async (req, res) => {
    try {
        const tasks = await Task.find({$and: [
            {user_id: req.user._id},
            {done: false},
            {canceled: false}
        ]}).sort('date')
        const expired = []
        const todo = []
        const now = new Date()
        tasks.forEach(task => {
            const date = new Date(task.date)
            if(date.getTime() < now.getTime()) expired.push(task)
            else todo.push(task)
        })
        res.json([...expired, ...todo]);
    } catch (error) {
        res.json(error);
    }
}

controller.state = async (req, res) => {
    try {
        const lastweek = new Date()
        lastweek.setDate(lastweek.getDate() - 3)
        const tasks = req.params.state == 'done' ?
            await Task.find({$and: [
                {user_id: req.user._id},
                {done: true},
                {updatedAt: {$gte: lastweek}}
            ]}).sort('-updatedAt') :
            await Task.find({$and: [
                {user_id: req.user._id},
                {canceled: true},
                {updatedAt: {$gte: lastweek}}
            ]}).sort('-updatedAt')
        res.json(tasks);
    } catch (error) {
        res.json(error);
    }
}

controller.user = async (req, res) => {
    try {
        const tasks = await Task.find({user_id: req.user._id}).sort('-date')
        const todo = [], canceled = [], done = []
        tasks.forEach(task => {
            if(task.done) done.push(task)
            else if(task.canceled) canceled.push(task)
            else todo = []
        })
        res.json({todo, canceled, done});
    } catch (error) {
        res.json(error);
    }
}

module.exports = controller;