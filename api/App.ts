import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import routes from './routes/index.route';
import config from './config/config';
import routerService from './services/router.service';

class App {
  public express;

  constructor () {
    this.express = express();
    this.setCorsOptions();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    this.express.use(bodyParser.json());
    this.express.use(((req, res, next) => {
      if (routerService.isDownloadRoute(req.originalUrl) || req.get('Content-Type') === 'application/json'
        || (req.get('Content-Type') && req.get('Content-Type').includes('multipart/form-data'))) {
        if (req.get('Content-Type') && req.get('Content-Type').includes('multipart/form-data')) {
          this.express.use(bodyParser.urlencoded({ extended: true }));
        }
        next();
      } else {
        res.status(400).send({ err: 'Only content-type \'application/json\' or \'multipart/form-data\' is accepted!' });
      }
    }));
    this.express.use('/api/v1/', routes);
    this.express.get('*', (req, res) => {
      res.redirect(`${config.baseUrlFrontend}`);
    });
  }

  private setCorsOptions (): void {
    if (config.cors) {
      const corsOptionsDelegate = function (req, callback) {
        const origin = req.header('Origin');
        if (routerService.isDownloadRoute(req.originalUrl)
          || config.cors.whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      };
      this.express.use(cors(corsOptionsDelegate));
    } else {
      this.express.use(cors());
    }
  }
}

export default new App().express;
