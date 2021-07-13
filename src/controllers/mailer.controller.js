const User = require('../models/user.model');
const Agency = require('../models/agency.model');
const Invitation = require('../models/invitation.model');
const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();
const mailer = {};

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken();

const baseUrl = 'http://localhost:4200'

mailer.send = async (req, res) => {
    try {
      const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
          type: 'OAuth2',
          user: 'contacto.goldensub@gmail.com', 
          clientId: process.env.OAUTH_CLIENT_ID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
          accessToken: accessToken
        }
      });
    
      smtpTransport.sendMail({
        from: 'contacto.goldensub@gmail.com',
        to: 'jhserna.b0@gmail.com',
        subject: 'Contacto',
        html: `
          <h3>Contacto</h3>
          <ul>  
          <li>Nombre: ${req.body.name}</li>
          <li>Apellido: ${req.body.lastname}</li>
          <li>Email: ${req.body.email}</li>
          <li>Teléfono: ${req.body.phone}</li>
          </ul>
          <h3>Mensaje</h3>
          <p>${req.body.message}</p>
        `
      },(err, success) => {
        if(success) res.json('sent')
        else if (err) res.json('error')
      });
    } catch (error) {
      res.json(error.message);
    }
};

mailer.forgotenPassword = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    const encrypted = await Buffer.from(JSON.stringify(user)).toString('base64');
    const response = `${baseUrl}/restablecer?encoded=${encrypted}`;
      const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
          type: 'OAuth2',
          user: 'contacto.goldensub@gmail.com', 
          clientId: process.env.OAUTH_CLIENT_ID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
          accessToken: accessToken
        }
      });
    
      smtpTransport.sendMail({
        from: 'contacto.goldensub@gmail.com',
        to: req.body.email,
        subject: 'Recuperación de contraseña - Vilcom',
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
          }
          h1 {
            padding-right: 10%;
            padding-left: 10%;
            color: #1F5A76;
          }
    
          p {
            padding-right: 10%;
            padding-left: 10%;
          }
          </style>
        </head>
        <body>
          <div>
            <h1>Contraseña de Vilcom olvidada</h1>
            <p>Recibimos tu solicitud para recuperar tu contraseña, haz clic <a href="${response}">aquí</a> para restablecerla.</p>
    
            <p>Si tú no solicitaste este cambio, haz caso omiso de este mensaje.</p>
          </div>
        </body>
        </html>
        `
      },(err, success) => {
        if(success){
          res.json('sent')
        }else if (err){
          console.log(err)
          res.json('error')
        }
      });
      
    } catch (error) {
      res.json(error);
    }
};

mailer.verify = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if(!user) {
      res.json('unexisting user')
      res.end()
    }
    const encrypted = await Buffer.from(JSON.stringify(user)).toString('base64');
    const response = `${baseUrl}/verificar?encoded=${encrypted}`;

      const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
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
        subject: 'Verificación de la cuenta - Vilcom',
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
          }
          h1 {
            padding-right: 10%;
            padding-left: 10%;
            color: #1F5A76;
          }
          p {
            padding-right: 10%;
            padding-left: 10%;
          }
          </style>
        </head>
        <body>
          <div>
            <h1>Verifica tu cuenta de Vilcom</h1>
            <p>Para comenzar a usar tu cuenta de Vilcom haz click <a href="${response}">aquí</a></p>
    
            <p>Si no has solicitado este correo, por favor ignora este mensaje.</p>
          </div>
        </body>
        </html>
        `
      },(err, success) => {
        if(success){
          res.json('message sent')
        }else if (err){
          res.json(err)
        }
      });
      
    } catch (error) {
      res.json(error);
    }
};

mailer.invite = async (req, res) => {
  try {
    const user = req.user
    const invitation = await new Invitation(req.body)
    const member = await User.findOne({$and: [
      {email: invitation.email},
      {agency_id: invitation.agency_id}
    ]})
    if(member) {
      res.json({message: 'member'})
    } else {
      const existing = await Invitation.findOne({$and: [
        {agency_id: invitation.agency_id},
        {email: invitation.email}
      ]})
      if(existing) await Invitation.findOneAndRemove({_id: existing._id})
      const recipient = await invitation.save()
      const agency = await Agency.findById(req.body.agency_id)
  
      const encrypted = await Buffer.from(JSON.stringify(recipient)).toString('base64');
      const response = `${baseUrl}/inmobiliaria/invitacion?encoded=${encrypted}`;
  
      const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
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
        to: recipient.email,
        subject: `${user.name} te ha invitado a ${agency.name} - Vilcom`,
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
          }
          h1 {
            padding-right: 10%;
            padding-left: 10%;
            color: #1F5A76;
          }
          p {
            padding-right: 10%;
            padding-left: 10%;
          }
          </style>
        </head>
        <body>
          <div>
            <h1>Haz recibido una invitación para colaborar en Vilcom</h1>
            <p>${user.name}(${user.email}) te ha invitado a formar parte de ${agency.name}</p>
            <p>Para ver la invitación haz click <a href="${response}">aquí</a></p>
    
            <p>Si crees que has recibido este correo por error, por favor ignora este mensaje.</p>
          </div>
        </body>
        </html>
        `
      },(err, success) => {
        if(success){
          res.json({message: 'message sent', invitation: recipient})
        }else if (err){
          res.json({message: 'error', err})
        }
      });
    }
    } catch (error) {
      res.json({message: 'error', error});
    }
};

module.exports = mailer;