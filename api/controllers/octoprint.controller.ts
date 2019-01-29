/* eslint-disable no-unused-vars */
import * as request from 'request';
import * as fs from 'fs';
import * as util from 'util';
import { Request, Response } from 'express';
import config from '../config/config';
// import { IError, ErrorType } from '../services/router.service';
import { FileService } from '../services/file.service';
import logger from '../logger';
import OrderService from '../services/order.service';

const { pipeline } = require('stream');
/* eslint-enable no-unused-vars */

const fileService = new FileService();
const orderService = new OrderService();

async function uploadFile (req: Request, res: Response) {
  if (req.params.id && req.body && req.body.apiKey && req.body.octoprintAddress) {
    const pipeLine = util.promisify(pipeline);
    const targetLocation = req.body.location && req.body.location === 'sdcard' ? 'sdcard' : 'local';
    const fileStream = await fileService.downloadFile(req.params.id, config.attachmentBucket);
    if (!fs.existsSync(`${config.tmpDir}`)) {
      fs.mkdirSync(`${config.tmpDir}`);
    }

    const orders = await orderService.getAll({ 'files.id': req.params.id }, 1, 0);

    const order = orders && orders.length ? orders[0] : undefined;

    const file = order.files.find((elem) => elem.id === req.params.id);

    const writeStream = fs.createWriteStream(`${config.tmpDir}/${file.filename}`);
    fileStream.pipe(writeStream);

    await pipeLine(
      fileStream,
      writeStream
    );
    const formData = {
      file: {
        value: fs.createReadStream(`${config.tmpDir}/${file.filename}`),
        options: {
          filename: file.filename,
          contentType: file.contentType
        }
      }
    };
    return request.post({
      url: `${req.body.octoprintAddress}/api/files/${targetLocation}`,
      headers: {
        'X-Api-Key': req.body.apiKey,
      },
      formData
    }, (err, httpResponse, body) => {
      fs.unlinkSync(`${config.tmpDir}/${file.filename}`);
      const { statusCode } = { statusCode: httpResponse.statusCode };
      if (err) {
        logger.error('upload failed:', err);
      } else {
        logger.info('Upload to Octoprint successful!  Server responded with:', body);
      }
      return res.status(statusCode).send(body);
    });
  }
  return res.status(400).send();
}

export default { uploadFile };
