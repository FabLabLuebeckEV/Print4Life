
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import app from './App';
import logger from './logger';
import config from './config/config';

let privateKey = '';
let certificate = '';
let serverInstance: any;

if (process.env.NODE_ENV && (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging')) {
  privateKey = fs.readFileSync(config.ssl.privateKeyPath, 'utf8');
  if (privateKey.length) {
    logger.info('SSL private key found and loaded.');
  }
  certificate = fs.readFileSync(config.ssl.certificatePath, 'utf8');
  if (privateKey.length) {
    logger.info('SSL certificate found and loaded.');
  }
}

const credentials = { key: privateKey, cert: certificate };

if (credentials && credentials.key && credentials.cert && process.env
  && (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging')) {
  serverInstance = https.createServer(credentials, app);
  logger.info('Starting HTTPs Server!');
} else {
  serverInstance = http.createServer(app);
  logger.info('Starting HTTP Server!');
}

function run (callback) {
  const port = process.env.PORT || 3000;
  const ngPort = process.env.NG_PORT || 4200;
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(config.connections.mongo.host + config.connections.mongo.database,
      { autoReconnect: true, useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    })
    .catch((error) => logger.error(error));
  const db = mongoose.connection;


  db.on('error', () => {
    logger.error('DB Connection Error!');
  });

  const server = serverInstance.listen(port, (err) => {
    if (err) {
      return logger.error(err);
    }

    if (callback) {
      callback();
    }

    return logger.info(
      `server is in ${process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'} `
      + `mode and listening on ${port}. Angular (if started) is listening on ${ngPort}`
    );
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
