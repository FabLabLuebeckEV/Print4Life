import * as mongoose from 'mongoose';

import logger from '../logger';
import printerSchema from '../models/printer.model';

const Printer = mongoose.model('Printer', printerSchema);

/**
 * @api {get} /api/v1/machine/printer Request the list of printers
 * @apiName GetPrinters
 * @apiVersion 0.0.1
 * @apiGroup Machines
 *
 * @apiSuccess {Array} printers an array of printer objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*    {
      "printers": [
        {
            "_id": "5b453dbe5cf4a9574849e96e",
            "id": 3,
            "fid": 2,
            "deviceName": "Ultimaker 2+",
            "manufacturer": "Ultimaker",
            "camSoftware": "Cura",
            "printVolumeX": 210,
            "printVolumeY": 210,
            "printVolumeZ": 205,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 0.5,
            "nozzleDiameter": 0.4,
            "numberOfExtruders": 1,
            "pictureURL": "upload/59e5da27a317a.jpg",
            "comment": ""
        },
        {
            "_id": "5b453dbe5cf4a9574849e96f",
            "id": 4,
            "fid": 2,
            "deviceName": "Zprinter 450",
            "manufacturer": "Zcorp",
            "camSoftware": "",
            "printVolumeX": 200,
            "printVolumeY": 200,
            "printVolumeZ": 180,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 1,
            "nozzleDiameter": null,
            "numberOfExtruders": 0,
            "pictureURL": "upload/59e5dc87040cc.jpg",
            "comment": "Full Color printer"
        }
      ]
    }
 */
function getPrinters () {
  return Printer.find((err, printers) => {
    if (err) {
      return logger.error(err);
    } else if (printers) {
      return printers;
    }
    return [];
  });
}

export default { getPrinters };
