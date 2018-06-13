import * as express from 'express';
import routes from './routes/index.route';

class App {
  public express;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    this.express.use('/', routes);
  }
}

export default new App().express;
