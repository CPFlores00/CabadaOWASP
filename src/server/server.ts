import * as express from 'express';
import { Application } from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as nodemailer from 'nodemailer';
import * as bodyParser from 'body-parser';


const app: Application = express();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  provider: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: ' ',
    pass: ' '
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'secure', type: Boolean, defaultOption: true },
];

const options = commandLineArgs(optionDefinitions);

const httpsServer = app.listen(9000, () => {
  console.log("HTTP Server Running");
});
