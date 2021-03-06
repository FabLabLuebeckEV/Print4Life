import * as Nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import * as path from 'path';
import config from '../config/config';
import logger from '../logger';

const env = process.env.NODE_ENV;
let email:Email;
const transporter = Nodemailer.createTransport(config.email);

transporter.verify((error, success) => {
  if (error) {
    logger.info(error);
  } else if (success) {
    logger.info('E-Mail Server is ready to take our messages');
  }
});

if (env !== 'dev' && env !== 'prod') {
  email = new Email({
    message: {
      from: config.email.from
    },
    send: true,
    transport: transporter
  });
  logger.info(config);
  logger.info(email);
} else {
  email = new Email({
    message: {
      from: config.email.from
    },
    transport: transporter
  });
}

export interface EmailOptions {
  preferredLanguage: string;
  template: string;
  to: string;
  cc?: string;
  locals: any;
}

function sendMail (options: EmailOptions) {
  const dir = path.join(__dirname, '../', 'config', 'email-templates', options.preferredLanguage, options.template);
  email
    .send({
      template: dir,
      message: {
        to: options.to,
        cc: options.cc
      },
      locals: options.locals
    })
    .then((info: any) => logger.info(info))
    .catch((err: Error) => logger.error(err.message));
}

export default { sendMail };
