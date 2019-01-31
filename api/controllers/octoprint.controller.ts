/* eslint-disable no-unused-vars */
import * as request from 'request';
import * as fs from 'fs';
import * as util from 'util';
import { Request, Response } from 'express';
import config from '../config/config';
import { IError, ErrorType } from '../services/router.service';
import { FileService } from '../services/file.service';
import validatorService from '../services/validator.service';
import logger from '../logger';
import OrderService from '../services/order.service';

const { pipeline } = require('stream');
/* eslint-enable no-unused-vars */

const fileService = new FileService();
const orderService = new OrderService();

/**
 * @api {post} /api/v1/octoprint/uploadFile/:id Uploads a file of an order to octoprint
 * @apiName uploadFileToOctoprint
 * @apiVersion 1.0.0
 * @apiGroup Octoprint
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} apiKey is the api key for octoprint (required)
 * @apiParam {String} octoprintAddress is the address of octoprint (required)
 * @apiParam {String} location is the location on the filesystem of octoprint (local/sdcard; defaults to local)
 * @apiSuccess { Object } body the resonse body of octoprint
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "done": true,
    "files": {
        "local": {
            "name": "Calibration_Dice_2_Colours_20.stl",
            "origin": "local",
            "path": "Calibration_Dice_2_Colours_20.stl",
            "refs": {
                "download": "http://localhost:5000/downloads/files/local/Calibration_Dice_2_Colours_20.stl",
                "resource": "http://localhost:5000/api/files/local/Calibration_Dice_2_Colours_20.stl"
            }
        }
    }
}
   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Error while trying to upload the file!",
      "type": 13,
      "stack": {...}, // optional
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Id! Check if id is a 24 character long hex string!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Id! Please provide a valid id!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request! Id of file, address of octoprint and api key for octoprint needs to be provided!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

     * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 4xx Malformed Request
  {
      "name": "OCTOPRINT_ERROR",
      "message": "{...}",
      "type": 15,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 *
 */

async function uploadFile (req: Request, res: Response) {
  let error: IError;
  if (req.params.id && req.body && req.body.apiKey && req.body.octoprintAddress) {
    const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
    if (checkId) {
      logger.error(checkId.error);
      return res.status(checkId.status).send(checkId.error);
    }
    try {
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
        let { statusCode, statusMessage } = {
          statusCode: httpResponse ? httpResponse.statusCode : undefined,
          statusMessage: httpResponse ? httpResponse.statusMessage : undefined
        };
        if (err || statusCode >= 300) {
          statusCode = statusCode || 502;
          body = !body && statusCode === 502 ? `Connection refused to ${req.body.octoprintAddress}` : body;
          statusMessage = statusMessage || (err ? err.message : undefined);
          logger.error(`Upload to octoprint on ${req.body.octoprintAddress} `
            + `failed: ${statusCode} - ${statusMessage} ${err ? '-' : ''} ${err || ''}`);
          body = {
            name: 'OCTOPRINT_ERROR',
            type: ErrorType.OCTOPRINT_ERROR,
            message: body || err.message,
            stack: err ? err.stack : undefined
          };
        } else {
          logger.info(`Upload to octoprint on ${req.body.octoprintAddress} successful!`
            + `Server responded with ${statusCode} - ${statusMessage} ${body ? '-' : ''} ${body || ''}`);
        }
        return res.status(statusCode).send(body);
      });
    } catch (err) {
      error = {
        name: 'SERVER_ERROR',
        message: 'Error while trying to upload the file!',
        type: ErrorType.SERVER_ERROR,
        stack: err && err.message ? err.message : ''
      };
      logger.error(error);
      return res.status(500).send(error);
    }
  }
  error = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! Id of file, address of octoprint and api key for octoprint needs to be provided!',
    type: ErrorType.MALFORMED_REQUEST
  };
  logger.error(error);
  return res.status(400).send(error);
}

/**
 * @api {post} /api/v1/octoprint/print/:id Starts a print job on octoprint
 * @apiName StartPrintJobOnOctoprint
 * @apiVersion 1.0.0
 * @apiGroup Octoprint
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} apiKey is the api key for octoprint (required)
 * @apiParam {String} octoprintAddress is the address of octoprint (required)
 * @apiParam {String} location is the location on the filesystem of octoprint (local/sdcard; defaults to local)
 * @apiSuccess { Object } body the resonse body of octoprint
 *
   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Error while trying to start a printing job!",
      "type": 13,
      "stack": {...}, // optional
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Id! Check if id is a 24 character long hex string!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Id! Please provide a valid id!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request! Id of file, address of octoprint and api key for octoprint needs to be provided!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 4xx Malformed Request
  {
      "name": "OCTOPRINT_ERROR",
      "message": "Printer is not operational, cannot directly start printing",
      "type": 15,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 *
 */
async function startPrint (req: Request, res: Response) {
  let error: IError;
  if (req.params.id && req.body && req.body.apiKey && req.body.octoprintAddress) {
    const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
    if (checkId) {
      logger.error(checkId.error);
      return res.status(checkId.status).send(checkId.error);
    }
    try {
      const targetLocation = req.body.location && req.body.location === 'sdcard' ? 'sdcard' : 'local';

      const orders = await orderService.getAll({ 'files.id': req.params.id }, 1, 0);

      const order = orders && orders.length ? orders[0] : undefined;

      const file = order.files.find((elem) => elem.id === req.params.id);

      return request.post({
        url: `${req.body.octoprintAddress}/api/files/${targetLocation}/${file.filename}`,
        headers: {
          'X-Api-Key': req.body.apiKey,
        },
        body: { command: 'select', print: true },
        json: true
      }, (err, httpResponse, body) => {
        let { statusCode, statusMessage } = {
          statusCode: httpResponse ? httpResponse.statusCode : undefined,
          statusMessage: httpResponse ? httpResponse.statusMessage : undefined
        };
        if (err || statusCode >= 300) {
          statusCode = statusCode || 502;
          statusMessage = statusMessage || (err ? err.message : undefined);
          logger.error(`Upload to octoprint on ${req.body.octoprintAddress} `
            + `failed: ${statusCode} - ${statusMessage} ${err ? '-' : ''} ${err || ''}`);
          body = {
            name: 'OCTOPRINT_ERROR',
            type: ErrorType.OCTOPRINT_ERROR,
            message: body || err.message,
            stack: err ? err.stack : undefined
          };
        } else {
          logger.info(`Print job started on ${req.body.octoprintAddress} successful!`
            + `Server responded with ${statusCode} - ${statusMessage} ${body ? '-' : ''} ${body || ''}`);
        }
        return res.status(statusCode).send(body);
      });
    } catch (err) {
      error = {
        name: 'SERVER_ERROR',
        message: 'Error while trying to start a printing job!',
        type: ErrorType.SERVER_ERROR,
        stack: err && err.message ? err.message : ''
      };
      logger.error(error);
      return res.status(500).send(error);
    }
  }
  error = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! Id of file, address of octoprint and api key for octoprint needs to be provided!',
    type: ErrorType.MALFORMED_REQUEST
  };
  logger.error(error);
  return res.status(400).send(error);
}

export default { uploadFile, startPrint };
