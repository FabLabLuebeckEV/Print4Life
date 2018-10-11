import * as Nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import * as path from 'path';
import config from '../config/config';
import logger from '../logger';

const env = process.env.NODE_ENV;
let email;

const transporter = Nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.address,
    pass: config.email.password
  }
});

if (env !== 'dev' && env !== 'prod') {
  email = new Email({
    message: {
      from: config.email.address
    },
    send: true,
    transport: {
      jsonTransport: true
    }
  });
} else {
  email = new Email({
    message: {
      from: config.email.address
    },
    transport: transporter
  });
}

/* eslint-disable no-undef */
export interface EmailOptions {
    preferredLanguage: string;
    template: string;
    to: string;
    locals: any;
}
/* eslint-enable no-undef */

function sendMail (options: EmailOptions) {
  const dir = path.join(__dirname, '../', 'config', 'email-templates', options.preferredLanguage, options.template);
  email
    .send({
      template: dir,
      message: {
        to: options.to,
      },
      locals: options.locals
    })
    .then((info) => logger.info(info))
    .catch((err) => logger.error(err.message));
}

export default { sendMail };
