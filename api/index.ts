import * as mongoose from 'mongoose';
import app from './App';
import logger from './logger';
import config from './config/config';

const port = process.env.PORT || 3000;
const ngPort = process.env.NODE_ENV === 'dev' ? 4200 : 80;
mongoose
  .connect(config.connections.mongo.host + config.connections.mongo.database, { autoReconnect: true })
  .catch((error) => logger.error(error));
const db = mongoose.connection;

db.on('error', () => {
  logger.error('DB Connection Error!');
});

app.listen(port, (err) => {
  if (err) {
    return logger.error(err);
  }

  return logger.info(`server is listening on ${port} and angular (if started) on ${ngPort}`);
});
