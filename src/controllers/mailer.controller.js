const User = require('../models/user.model');
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

const baseUrl = 'https://mean-core.herokuapp.com'

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
    const response = `${baseUrl}/forgetPassword?encoded=${encrypted}`;
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
        subject: 'Recuperación de contraseña',
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
            background: #29637D;
            font-family: 'Roboto', sans-serif;
          }
          .container {
            margin: 20%;
            background: white;
            padding-bottom: 10%;
          }
    
          h1 {
            padding-right: 10%;
            padding-left: 10%;
            
          }
    
          p {
            padding-right: 10%;
            padding-left: 10%;
          }
    
          a {
            padding-right: 10%;
            padding-left: 10%;
          }
          </style>
        </head>
        <body>
          <div class="container">
              <img src="${baseUrl}/assets/icons/logo.svg" style="padding-left: 10%; padding-top: 10%">
            <h1 align="center">Contraseña olvidada</h1>
            <p align="justify">Recibimos tu solicitud para recuperar tu contraseña, haz clic <a href="${response}">aquí</a> para restablecerla.</p>
    
            <p align="justify">Si tú no solicitaste este cambio, haz caso omiso de este mensaje.</p>
          </div>
        </body>
        </html>
        `
      },(err, success) => {
        if(success){
          res.json('sent')
        }else if (err){
          res.json('error')
        }
      });
      
    } catch (error) {
      res.json(error);
    }
};

mailer.validate = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    const encrypted = await Buffer.from(JSON.stringify(user)).toString('base64');
    const response = `https://${baseUrl}/validate?encoded=${encrypted}`;

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
        to: req.body.email,
        subject: 'Account validation',
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
            background: #fff;
            font-family: 'Roboto', sans-serif;
          }
          .container {
            padding-bottom: 10%;
          }
          h1 {
            padding-right: 10%;
            padding-left: 10%;
          }
          p {
            padding-right: 10%;
            padding-left: 10%;
          }
          svg {
            padding-left: 10%;
          }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verify your register</h1>
            <p align="justify">You can start using your account by clicking <a href="${response}">here</a></p>
    
            <p align="justify">If you did not make this request, please ignore this email.</p>
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

module.exports = mailer;