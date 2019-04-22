import * as express from 'express';
import { Application, Router, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
// import * as https from 'https';
// import * as csrf  from 'csurf';
import * as nodemailer from 'nodemailer';
// import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as userRoutes from './routes/userRoutes';

class Server {

  protected app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config() {
    // Settings
    dotenv.config();
    this.app.set('port', process.env.PORT_SERVER || 3000);
    this.app.disable('case sensitive routing');
    this.app.enable('json escape');
    this.app.disable('strict routing');
    // Middlewares
    this.setup_database();
    this.setup_cors();
    this.app.use(express.json());
    this.app.use(express.urlencoded({
      extended: true
    }));
    this.config_security();
    // this.app.use(cookieParser('Gh54yG5305-pZalDj066'));
    // this.app.use(bodyParser.json());
    this.app.use(compression());
    // this.app.use(cors());
  }

  private setup_database() {
    const MONGODB_URI: string = `mongodb://${ process.env.MONGODB_USER }:${ process.env.MONGODB_PASSWORD }@ds139956.mlab.com:39956/cabada-project`;
    const MONGODB_OPTIONS: any = {
      useCreateIndex: true, // to false in production mode
      useNewUrlParser: true
    };
    mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
  }

  private config_security() {
    this.app.use(helmet());
    // Remove default x-powered-by response header
    this.app.disable('x-powered-by');
    // Prevent opening page in frame or iframe to protect from clickjacking
    this.app.use(helmet.frameguard({ action: 'sameorigin' }));
    // Prevents browser from caching and storing page
    this.app.use(helmet.noCache());
    // Allow loading resources only from white-listed domains
    // -- app.use(helmet.contentSecurityPolicy());
    // Allow communication only on HTTPS
    // -- app.use(helmet.hsts());
    // Enable XSS filter in IE (On by default)
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.xssFilter({ setOnOldIE: true }));
    // Forces browser to only use the Content-Type set in the response header instead of sniffing or guessing it
    this.app.use(helmet.noSniff());

    // Enable Express csrf protection
    // this.app.use(csrf());
    // Make csrf token available in templates
    /*this.app.use((req, res, next) => {
      res.locals.csrftoken = req.csrfToken();
      next();
    });*/
  }

  private setup_cors() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // -- res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  private setup_ssl_cert() {
    const httpsOptions = {
      key: fs.readFileSync(path.resolve(__dirname, 'key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'crt'))
    };
  }

  private mail_send() {
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
  }

  private routes() {
    const router: Router = userRoutes.default.router;
    
    router.use((req: Request, res: Response, next: NextFunction) => {
      console.log('%s %s %s', req.method, req.url, req.path);
      next();
    });

    this.app.use(router);
  }

  public start() {
    this.app.listen(this.app.get('port'), () => {
      console.log(`HTTP Server Running on ${ process.env.HOST_URL }`);
    });
  }

}

const server: Server = new Server();
server.start();
