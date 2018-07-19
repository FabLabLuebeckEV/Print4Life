import * as express from 'express';
import * as cors from 'cors';

import routes from './routes/index.route';
import config from './config';

class App {
  public express;

  constructor () {
    this.express = express();
    this.setCorsOptions();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    this.express.use('/api/v1/', routes);
    this.express.get('*', (req, res) => {
      res.redirect(`${config.baseUrlFrontend}`);
    });
  }

  private setCorsOptions (): void {
    config.cors.corsOptions.origin = function (origin, callback) {
      if (config.cors.whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    };
    this.express.use(cors(config.cors.corsOptions));
  }
}

export default new App().express;
