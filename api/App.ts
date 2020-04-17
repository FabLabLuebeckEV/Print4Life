import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import routes from './routes/index.route';
import config from './config/config';
import routerService from './services/router.service';
import logger from './logger';

const csv = require('csv-parser');
const fs = require('fs');

class App {
  public express: express.Express;

  public geolocations = {};

  constructor () {
    this.express = express();
    this.setCorsOptions();
    this.mountRoutes();

    logger.info('created app component');

    fs.createReadStream('dist/assets/PLZ.csv')
      .pipe(csv())
      .on('data', (row) => {
        this.geolocations[row.PLZ] = [parseFloat(row.Lon), parseFloat(row.Lat)];
      })
      .on('end', () => {

      });
  }

  private mountRoutes (): void {
    this.express.use(bodyParser.json());
    this.express.use(((req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (routerService.corsAllowedRoutes(req.originalUrl, req.method) || req.get('Content-Type') === 'application/json'
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
        if (routerService.corsAllowedRoutes(req.originalUrl, req.method)
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

export default new App();
