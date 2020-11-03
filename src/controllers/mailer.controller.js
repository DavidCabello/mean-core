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
        to: 'david0cabello0@gmail.com',
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
        if(success){
          res.json('message sent')
        }else if (err){
          res.json('message not sent')
        }
      });
      
    } catch (error) {
      res.json(error.message);
    }
   
};

mailer.forgotenPassword = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    const encrypted = await Buffer.from(JSON.stringify(user)).toString('base64');
    const response = 'https://mean-core.herokuapp.com/forgetPassword?encoded=' + encrypted;

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
              <img src="https://mean-core.herokuapp.com/assets/icons/logo.svg" style="padding-left: 10%; padding-top: 10%">
            <h1 align="center">Recuperación de contraseña</h1>
            <p align="justify">Recibimos la solicitud de recuperación de tu contraseña, la cual puedes actualizar en el siguiente link:</p>
            <a href="${response}">${response}</a>
    
            <p align="justify">En caso de no haber solicitado el cambio por favor ignora este mensaje.</p>
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