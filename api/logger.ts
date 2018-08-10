import * as winston from 'winston';

/**
 * Log only the messages the match `level`.
 */
function filterOnly (level) {
  return winston.format((info) => {
    let ret;
    if (info.level === level) {
      ret = info;
    }
    return ret;
  })();
}

const logger = winston.createLogger(
  {
    level: 'info',
    format: winston.format.combine(winston.format.json(), winston.format.timestamp(), winston.format.prettyPrint()),
    transports: [
      new winston.transports.File({ filename: 'logs/info.log', format: filterOnly('info'), level: 'info' }),
      new winston.transports.File({ filename: 'logs/error.log', format: filterOnly('error'), level: 'error' }),
      new winston.transports.Console()
    ]
  });

export default logger;
