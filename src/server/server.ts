import * as express from 'express';
import { Application } from 'express';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as csrf  from 'csurf';
import * as nodemailer from 'nodemailer';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as helmet from 'helmet';


const app: Application = express();
dotenv.config();
app.use(helmet());
// Remove default x-powered-by response header
// -- app.disable('x-powered-by');
// Prevent opening page in frame or iframe to protect from clickjacking
// -- app.use(helmet.frameguard({ action: 'sameorigin' }));
// Prevents browser from caching and storing page
// -- app.use(helmet.noCache());
// Allow loading resources only from white-listed domains
// -- app.use(helmet.contentSecurityPolicy());
// Allow communication only on HTTPS
// -- app.use(helmet.hsts());
// Enable XSS filter in IE (On by default)
// -- app.use(helmet.ieNoOpen());
// -- app.use(helmet.xssFilter({ setOnOldIE: true }));
// Forces browser to only use the Content-Type set in the response header instead of sniffing or guessing it
// -- app.use(helmet.noSniff());

// Enable Express csrf protection
app.use(csrf());
// Make csrf token available in templates
app.use((req, res, next) => {
  res.locals.csrftoken = req.csrfToken();
  next();
});

/*
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'crt'))
};
*/

const db: string = 'mongodb://admin:ilovebacon03@ds139956.mlab.com:39956/cabada-project';
mongoose.connect(db);

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

/*
import * as cla from 'command-line-args';
const optionDefinitions = [
  { name: 'secure', type: Boolean, defaultOption: true },
];
const options = cla(optionDefinitions);
*/

console.log(app.locals);

const httpsServer = app.listen(process.env.PORT_SERVER, () => {
  console.log(`HTTP Server Running on ${ process.env.HOST_URL }`);
});
