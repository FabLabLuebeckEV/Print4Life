

import * as mongoose from 'mongoose';
import app from './App';
import logger from './logger';
import config from './config';

function run (callback) {
  const port = process.env.PORT || 3000;
  const ngPort = process.env.NODE_ENV === 'dev' ? 4200 : 80;
  mongoose
    .connect(config.connections.mongo.host + config.connections.mongo.database, { autoReconnect: true })
    .catch((error) => logger.error(error));
  const db = mongoose.connection;

  db.on('error', () => {
    logger.error('DB Connection Error!');
  });

  const server = app.listen(port, (err) => {
    if (err) {
      return logger.error(err);
    }

    if (callback) {
      callback();
    }

    return logger.info(`server is listening on ${port} and angular (if started) on ${ngPort}`);
  });

  server.on('close', () => {
    logger.info('Server stopped');
  });

  return server;
}

if (require.main === module) {
  run(undefined);
}

exports.run = run;
