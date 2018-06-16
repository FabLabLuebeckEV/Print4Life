import * as express from 'express';
import routes from './routes/index.route';

class App {
  public express;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const ngPort = process.env.NODE_ENV === 'dev' ? 4200 : 80;
    this.express.use('/api/v1/', routes);
    this.express.get('*', (req, res) => {
      res.redirect(`http://localhost:${ngPort}`);
    });
  }
}

export default new App().express;
