import validatorService from '../services/validator.service';
import logger from '../logger';
import { Printer3DService } from '../services/3d-printer.service';
import MachineService from '../services/machine.service';

const printer3DService = new Printer3DService();

const machineService = new MachineService();

/**
 * @api {get} /api/v1/machines/3d-printer Get 3d-printer
 * @apiName Get3Dprinters
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} 3d-printers an array of printer objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "3d-printers": [
        {
            "_id": "5b55f7bf3fe0c8b01713b3fa",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Ultimaker 2+",
            "manufacturer": "Ultimaker",
            "materials": [
                {
                    "material": "PLA",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "Cura",
            "printVolumeX": 210,
            "printVolumeY": 210,
            "printVolumeZ": 205,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 0.5,
            "nozzleDiameter": 0.4,
            "numberOfExtruders": 1,
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b55f7bf3fe0c8b01713b3fc",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Zprinter 450",
            "manufacturer": "Zcorp",
            "materials": [
                {
                    "material": "Plaster",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "",
            "printVolumeX": 200,
            "printVolumeY": 200,
            "printVolumeZ": 180,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 1,
            "nozzleDiameter": null,
            "numberOfExtruders": 0,
            "comment": "Full Color printer",
            "__v": 0
        }
      ]
    }
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 206 Partial Content
{
    "3d-printers": [
        {
            "_id": "5b55f7bf3fe0c8b01713b3fa",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Ultimaker 2+",
            "manufacturer": "Ultimaker",
            "materials": [
                {
                    "material": "PLA",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "Cura",
            "printVolumeX": 210,
            "printVolumeY": 210,
            "printVolumeZ": 205,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 0.5,
            "nozzleDiameter": 0.4,
            "numberOfExtruders": 1,
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b55f7bf3fe0c8b01713b3fc",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Zprinter 450",
            "manufacturer": "Zcorp",
            "materials": [
                {
                    "material": "Plaster",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "",
            "printVolumeX": 200,
            "printVolumeY": 200,
            "printVolumeZ": 180,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 1,
            "nozzleDiameter": null,
            "numberOfExtruders": 0,
            "comment": "Full Color printer",
            "__v": 0
        }
      ]
    }
 */
function getAll (req, res) {
  printer3DService.getAll(undefined, req.query.limit, req.query.skip).then((printers3d) => {
    if ((printers3d && printers3d.length === 0) || !printers3d) {
      logger.info('GET 3D Printers with no result');
      res.status(204).send();
    } else if (printers3d && req.query.limit && req.query.skip) {
      logger.info(`GET 3D Printers with partial result ${JSON.stringify(printers3d)}`);
      res.status(206).send({ '3d-printers': printers3d });
    } else if (printers3d) {
      logger.info(`GET 3D Printers with result ${JSON.stringify(printers3d)}`);
      res.status(200).send({ '3d-printers': printers3d });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all printers', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {post} /api/v1/3d-printers/search Request the list of 3d printers by a given query
 * @apiName Search3DPrinters
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} users an array of 3d printer objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "3d-printers": [
        {
            "_id": "5b55f7bf3fe0c8b01713b3fa",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Ultimaker 2+",
            "manufacturer": "Ultimaker",
            "materials": [
                {
                    "material": "PLA",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "Cura",
            "printVolumeX": 210,
            "printVolumeY": 210,
            "printVolumeZ": 205,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 0.5,
            "nozzleDiameter": 0.4,
            "numberOfExtruders": 1,
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b55f7bf3fe0c8b01713b3fc",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Zprinter 450",
            "manufacturer": "Zcorp",
            "materials": [
                {
                    "material": "Plaster",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "",
            "printVolumeX": 200,
            "printVolumeY": 200,
            "printVolumeZ": 180,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 1,
            "nozzleDiameter": null,
            "numberOfExtruders": 0,
            "comment": "Full Color printer",
            "__v": 0
        }
      ]
    }
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 206 Partial Content
{
    "3d-printers": [
        {
            "_id": "5b55f7bf3fe0c8b01713b3fa",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Ultimaker 2+",
            "manufacturer": "Ultimaker",
            "materials": [
                {
                    "material": "PLA",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "Cura",
            "printVolumeX": 210,
            "printVolumeY": 210,
            "printVolumeZ": 205,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 0.5,
            "nozzleDiameter": 0.4,
            "numberOfExtruders": 1,
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b55f7bf3fe0c8b01713b3fc",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "3d-printer",
            "deviceName": "Zprinter 450",
            "manufacturer": "Zcorp",
            "materials": [
                {
                    "material": "Plaster",
                    "type": "printerMaterial"
                }
            ],
            "camSoftware": "",
            "printVolumeX": 200,
            "printVolumeY": 200,
            "printVolumeZ": 180,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 1,
            "nozzleDiameter": null,
            "numberOfExtruders": 0,
            "comment": "Full Color printer",
            "__v": 0
        }
      ]
    }
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
 *   error: Error while trying to search for a specific 3d printer with query: {...},
 *   stack: {...}
 * }
*/
function search (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query);
  printer3DService.getAll(req.body.query, req.body.limit, req.body.skip).then((printers3d) => {
    if (printers3d.length === 0) {
      logger.info(`POST search for 3d printers with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ '3d-printers': printers3d });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for 3d printers with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds partial results ${JSON.stringify({ '3d-printers': printers3d })}`);
      res.status(206).send({ '3d-printers': printers3d });
    } else {
      logger.info(`POST search for 3d printers with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds results ${JSON.stringify({ '3d-printers': printers3d })}`);
      res.status(200).send({ '3d-printers': printers3d });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific 3d printer with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific 3d printer with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
  });
}

/**
 * @api {post} /api/v1/machines/3d-printers/count Counts the 3D Printers
 * @apiName CountPrinters
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Object} count the number of 3d-printers
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *
{
    "count": 98
}
 *
 */
function count (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query);
  printer3DService.count(req.body.query).then((count) => {
    logger.info(`GET count 3D printers with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying count all 3D printers', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {get} /api/v1/machines/3d-printers/:id/countSuccessfulOrders
 * Counts the number of successful (representive and completed) orders of a 3D Printer by a given id
 * @apiName CountSuccessfulOrders3DPrinters
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the 3D-Printer
 *
 * @apiSuccess {Object} machineId is the id of the 3D-Printer object
 * @apiSuccess {number} successfulOrders is the number of successful orders
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "machineId": "5b55f7bf3fe0c8b01713b3ee",
    "successfulOrders": 2
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Id needs to be a 24 character long hex string!"
}
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Could not get successful orders for machine Id 9999""
 *     }
 *
 *
 */
async function countSuccessfulOrders (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    try {
      const successfulOrders = await machineService.countSuccessfulOrders(req.params.id);
      const orders = [];
      successfulOrders.forEach((order: { id: string, projectname: string }) => {
        orders.push({ id: order.id, projectname: order.projectname });
      });
      logger.info(`Successful Orders of machine with id ${req.param.id}: ${successfulOrders}`);
      res.status(200).send({ machineId: req.params.id, orders, successfulOrders: successfulOrders.length });
    } catch (err) {
      const msg = { error: `Could not get successful orders for machine Id ${req.param.id}!`, stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    }
  }
}

/**
 * @api {post} /api/v1/machines/3d-printers/ Create new Printer
 * @apiName CreateNewPrinter
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {Array} materials array of material objects
 * @apiParam {String} camSoftware name of the cam software
 * @apiParam {Number} printVolumeX print volume of axis x
 * @apiParam {Number} printVolumeY print volume of axis y
 * @apiParam {Number} printVolumeZ print volume of axis z
 * @apiParam {Number} printResolutionX resolution of the print at axis x
 * @apiParam {Number} printResolutionY resolution of the print at axis y
 * @apiParam {Number} printResolutionZ resolution of the print at axis z
 * @apiParam {Number} nozzleDiameter the nozzle diameter
 * @apiParam {Number} numberOfExtruders the number of extruders
 * @apiParam {String} comment a comment about the device
 * @apiParamExample {json} Request-Example:
 *
 {
   "fablabId": "5b453ddb5cf4a9574849e98a",
   "deviceName":"Test Printer" ,
   "manufacturer": "Test Manufacturer" ,
   "materials": [{
     "material": "PLA",
     "type": "printerMaterial"
   }],
   "camSoftware": "Test Software",
   "printVolumeX": 2,
   "printVolumeY": 2,
   "printVolumeZ": 2,
   "printResolutionX": 2,
   "printResolutionY": 2,
   "printResolutionZ": 2,
   "nozzleDiameter": 2,
   "numberOfExtruders": 2,
   "comment": "Create Test"
}
 *
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 OK
{
    "3d-printer": {
        "_id": "5b571447d748f04e8a0581ab",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Printer",
        "type": "3d-printer",
        "manufacturer": "Test Manufacturer",
        "materials": [
            {
                "material": "PLA",
                "type": "printerMaterial"
            }
        ],
        "camSoftware": "Test Software",
        "printVolumeX": 2,
        "printVolumeY": 2,
        "printVolumeZ": 2,
        "printResolutionX": 2,
        "printResolutionY": 2,
        "printResolutionZ": 2,
        "nozzleDiameter": 2,
        "numberOfExtruders": 2,
        "comment": "Create Test",
        "__v": 0
    }
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "err": "Malformed request!",
    "stack": {
        "errors": {
            "fablabId": {
                "message": "Path `fablabId` is required.",
                "name": "ValidatorError",
                "properties": {
                    "message": "Path `fablabId` is required.",
                    "type": "required",
                    "path": "fablabId",
                    "value": ""
                },
                "kind": "required",
                "path": "fablabId",
                "value": "",
                "$isValidatorError": true
            }
        },
        "_message": "Printer validation failed",
        "message": "Printer validation failed: fablabId: Path `fablabId` is required.",
        "name": "ValidationError"
    }
}
 *
 *
 */
function create (req, res) {
  printer3DService.create(req.body).then((printer3d) => {
    logger.info(`POST 3D Printers with result ${JSON.stringify(printer3d)}`);
    res.status(201).send({ '3d-printer': printer3d });
  }).catch((err) => {
    const msg = { err: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
}

/**
 * @api {delete} /api/v1/machines/3d-printers/:id Deletes a Printer by a given id
 * @apiName Delete3DPrinterById
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the printer
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *
 * {
    "_id": "5b66d17a250f8f3209d31577",
    "fablabId": "5b453ddb5cf4a9574849e98a",
    "deviceName": "Test Printer",
    "manufacturer": "Test Manufacturer",
    "activated": false,
    "materials": [
        {
            "_id": "5b66d17a250f8f3209d31578",
            "material": "PLA",
            "type": "printerMaterial"
        }
    ],
    "camSoftware": "Test Software",
    "printVolumeX": 2,
    "printVolumeY": 2,
    "printVolumeZ": 2,
    "printResolutionX": 2,
    "printResolutionY": 2,
    "printResolutionZ": 2,
    "nozzleDiameter": 2,
    "numberOfExtruders": 2,
    "comment": "Create Test",
    "type": "3d-printer",
    "__v": 0
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Id needs to be a 24 character long hex string!"
}

 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Malformed request!"
}

 * @apiError 404 Printer not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "error: `Printer by id 9999 not found!`"
}
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
    "error": "Error while trying to get the Printer by id 9999",
}

 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
   "error": "Error while trying to delete the Printer with id 9999"
}
 *
 *
 */
function deleteById (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    let printer3d;
    printer3DService.get(req.params.id).then((p) => {
      if (p) {
        printer3d = p;
        printer3DService.deleteById(req.params.id).then((result) => {
          if (result) {
            printer3DService.get(req.params.id).then((result) => {
              if (result) {
                logger.info(`DELETE 3D Printer with result ${JSON.stringify(printer3d)}`);
                res.status(200).send({ '3d-printer': result });
              }
            }).catch((err) => {
              const msg = { err: `Error while trying to get the 3D Printer by id ${req.params.id}`, stack: err };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = { err: `Error while trying to delete the 3D Printer with id ${req.params.id}` };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { err: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { err: `3D Printer by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { err: `Error while trying to get the 3D Printer by id ${req.params.id}`, stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
}

/**
 * @api {get} /api/v1/machines/3d-printers/:id Gets a Printer by a given id
 * @apiName GetPrinterById
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the printer
 *
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "3d-printers": {
        "_id": "5b61b2a1ed80e42748255735",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Printer",
        "manufacturer": "Test Manufacturer",
        "materials": [
            {
                "_id": "5b61b2a1ed80e42748255736",
                "material": "PLA",
                "type": "printerMaterial"
            }
        ],
        "camSoftware": "Test Software",
        "printVolumeX": 2,
        "printVolumeY": 2,
        "printVolumeZ": 2,
        "printResolutionX": 2,
        "printResolutionY": 2,
        "printResolutionZ": 2,
        "nozzleDiameter": 2,
        "numberOfExtruders": 2,
        "comment": "Create Test",
        "type": "3d-printer",
        "__v": 0
    }
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Id needs to be a 24 character long hex string!"
}
 * @apiError 404 The object was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Printer by id '9999' not found"
 *     }
 *
 *
 */
function get (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    printer3DService.get(req.params.id).then((printer3d) => {
      if (!printer3d) {
        const msg = { error: `3D Printer by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET 3D Printer by Id with result ${JSON.stringify(printer3d)}`);
        res.status(200).send({ '3d-printer': printer3d });
      }
    }).catch((err) => {
      const msg = { err: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
}

/**
 * @api {put} /api/v1/machines/3d-printers/:id Updates a Printer by a given id
 * @apiName UpdatePrinterByID
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the printer
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {Array} materials array of material objects
 * @apiParam {String} camSoftware name of the cam software
 * @apiParam {Number} printVolumeX print volume of axis x
 * @apiParam {Number} printVolumeY print volume of axis y
 * @apiParam {Number} printVolumeZ print volume of axis z
 * @apiParam {Number} printResolutionX resolution of the print at axis x
 * @apiParam {Number} printResolutionY resolution of the print at axis y
 * @apiParam {Number} printResolutionZ resolution of the print at axis z
 * @apiParam {Number} nozzleDiameter the nozzle diameter
 * @apiParam {Number} numberOfExtruders the number of extruders
 * @apiParam {String} comment a comment about the device
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66a9d7cdb16f0a3e528630",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Test Printer (Updated)",
    "manufacturer" : "Test Manufacturer",
    "materials" : [
        {
            "_id" : "5b66a9d7cdb16f0a3e528631",
            "material" : "PLA",
            "type" : "printerMaterial"
        }
    ],
    "camSoftware" : "Test Software",
    "printVolumeX" : 2,
    "printVolumeY" : 2,
    "printVolumeZ" : 2,
    "printResolutionX" : 2,
    "printResolutionY" : 2,
    "printResolutionZ" : 2,
    "nozzleDiameter" : 2,
    "numberOfExtruders" : 2,
    "comment" : "Create Test",
    "type" : "3d-printer",
    "__v" : 0
}
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "3d-printer": {
        "_id": "5b66a9d7cdb16f0a3e528630",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Printer (Updated)",
        "manufacturer": "Test Manufacturer",
        "materials": [
            {
                "_id": "5b66a9d7cdb16f0a3e528631",
                "material": "PLA",
                "type": "printerMaterial"
            }
        ],
        "camSoftware": "Test Software",
        "printVolumeX": 2,
        "printVolumeY": 2,
        "printVolumeZ": 2,
        "printResolutionX": 2,
        "printResolutionY": 2,
        "printResolutionZ": 2,
        "nozzleDiameter": 2,
        "numberOfExtruders": 2,
        "comment": "Create Test",
        "type": "3d-printer",
        "__v": 0
    }
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Id needs to be a 24 character long hex string!"
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "No params to update given!"
}
 * @apiError 404 The object was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Printer by id '9999' not found"
 *     }
 *
 *
 */
function update (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else if (Object.keys(req.body).length === 0) {
    const msg = { error: 'No params to update given!' };
    logger.error(msg);
    res.status(400).send(msg);
  } else {
    printer3DService.get(req.params.id).then((printer3d) => {
      if (!printer3d) {
        const msg = { error: `3D Printer by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        printer3DService.update(req.params.id, req.body).then((printer3d) => {
          logger.info(`PUT 3D Printer with result ${JSON.stringify(printer3d)}`);
          res.status(200).send({ '3d-printer': printer3d });
        });
      }
    }).catch((err) => {
      const msg = { err: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
}

/**
 * @api {get} /api/v1/machines/3d-printers/:id/schedules Gets the schedules of a specific 3d-printer
 * @apiName getScheduleOf3DPrinters
 * @apiVersion 1.0.0
 * @apiGroup 3D-Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the 3d-printer (required)
 * @apiParam {String} startDay is the start day in this format YYYY-MM-DD (optional query param)
 * @apiParam {String} endDay is the end day in this format YYYY-MM-DD (optional query param)
 *
 * @apiSuccess {Array} schedules an array containing the schedule objects
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "schedules": [
        {
            "machine": {
                "type": "3d-printer",
                "id": "5bfe88759d1139444a95aa47"
            },
            "_id": "5bfe887e9d1139444a95aa7c",
            "startDate": "2018-11-29T12:22:12.076Z",
            "endDate": "2018-11-29T12:22:12.076Z",
            "fablabId": "5b453ddb5cf4a9574849e98a",
            "orderId": "5bfe88759d1139444a95aa48",
            "__v": 0
        },
        {
            "machine": {
                "type": "3d-printer",
                "id": "5bfe88759d1139444a95aa47"
            },
            "_id": "5bfe888e10fc87448a4a76b1",
            "startDate": "2018-11-28T12:22:34.777Z",
            "endDate": "2018-11-28T12:22:34.777Z",
            "fablabId": "5b453ddb5cf4a9574849e98a",
            "orderId": "5bfe888a10fc87448a4a768a",
            "__v": 0
        }
    ]
}
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content

 * @apiError 500 An Error occured
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 *     {
 *       "error": "Error while trying to get schedules of 3D-Printer!"
 *     }
 *
 *
 */
async function getSchedules (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    try {
      const schedules = await machineService.getSchedules(req.params.id, req.query);
      logger.info(`GET schedules for 3D-Printer with result ${JSON.stringify(schedules)}`);
      if (schedules.length) {
        res.status(200).send({ schedules });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      const msg = { error: 'Error while trying to get schedules of 3D-Printer!' };
      logger.error({ msg, stack: err.stack });
      res.status(500).send(msg);
    }
  }
}


export default {
  getAll, create, deleteById, get, update, count, countSuccessfulOrders, getSchedules, search
};
