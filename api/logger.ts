import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import config from './config/config';

const loggerRotateOptions = config.loggerRotateOptions;


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
      new DailyRotateFile(
        {
          filename: 'info.log',
          format: filterOnly('info'),
          level: 'info',
          ...loggerRotateOptions
        }),
      new DailyRotateFile(
        {
          filename: 'error.log',
          format: filterOnly('error'),
          level: 'error',
          ...loggerRotateOptions
        }),
      new winston.transports.Console()
    ]
  });

export default logger;
