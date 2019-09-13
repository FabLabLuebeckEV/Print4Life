import validatorService from '../services/validator.service';
import logger from '../logger';
import LasercutterService from '../services/lasercutter.service';
import MachineService from '../services/machine.service';

const lasercutterService = new LasercutterService();

const machineService = new MachineService();

/**
 * @api {get} /api/v1/machines/lasercutters Get lasercutters
 * @apiName GetLasercutters
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} lasercutters an array of lasercutter objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutters": [
        {
            "_id": "5b51c25c1058dc2189272724",
            "fablabId": 2,
            "type": "lasercutter",
            "deviceName": "Helix",
            "manufacturer": "Epilog",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272723",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "",
            "workspaceX": 600,
            "workspaceY": 450,
            "workspaceZ": 350,
            "laserPower": "40",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272728",
            "fablabId": 4,
            "type": "lasercutter",
            "deviceName": "MARS-130",
            "manufacturer": "Thunderlaser",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272727",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "RD-Works",
            "workspaceX": 1500,
            "workspaceY": 900,
            "workspaceZ": 250,
            "laserPower": "100",
            "comment": "",
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
    "lasercutters": [
        {
            "_id": "5b51c25c1058dc2189272724",
            "fablabId": 2,
            "type": "lasercutter",
            "deviceName": "Helix",
            "manufacturer": "Epilog",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272723",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "",
            "workspaceX": 600,
            "workspaceY": 450,
            "workspaceZ": 350,
            "laserPower": "40",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272728",
            "fablabId": 4,
            "type": "lasercutter",
            "deviceName": "MARS-130",
            "manufacturer": "Thunderlaser",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272727",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "RD-Works",
            "workspaceX": 1500,
            "workspaceY": 900,
            "workspaceZ": 250,
            "laserPower": "100",
            "comment": "",
            "__v": 0
        }
    ]
}
 * @apiPermission none
 */
function getAll (req, res) {
  lasercutterService.getAll(undefined, req.query.limit, req.query.skip).then((lasercutters) => {
    if ((lasercutters && lasercutters.length === 0) || !lasercutters) {
      logger.info('GET Lasercutters with no result');
      res.status(204).send();
    } else if (lasercutters && req.query.limit && req.query.skip) {
      logger.info(`GET Lasercutters with partial result ${JSON.stringify(lasercutters)}`);
      res.status(206).send({ lasercutters });
    } else if (lasercutters) {
      logger.info(`GET Lasercutters with result ${JSON.stringify(lasercutters)}`);
      res.status(200).send({ lasercutters });
    }
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
}

/**
 * @api {post} /api/v1/lasercutters/search Request the list of lasercutters by a given query
 * @apiName SearchLasercutters
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} users an array of lasercutter objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutters": [
        {
            "_id": "5b51c25c1058dc2189272724",
            "fablabId": 2,
            "type": "lasercutter",
            "deviceName": "Helix",
            "manufacturer": "Epilog",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272723",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "",
            "workspaceX": 600,
            "workspaceY": 450,
            "workspaceZ": 350,
            "laserPower": "40",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272728",
            "fablabId": 4,
            "type": "lasercutter",
            "deviceName": "MARS-130",
            "manufacturer": "Thunderlaser",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272727",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "RD-Works",
            "workspaceX": 1500,
            "workspaceY": 900,
            "workspaceZ": 250,
            "laserPower": "100",
            "comment": "",
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
    "lasercutters": [
        {
            "_id": "5b51c25c1058dc2189272724",
            "fablabId": 2,
            "type": "lasercutter",
            "deviceName": "Helix",
            "manufacturer": "Epilog",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272723",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "",
            "workspaceX": 600,
            "workspaceY": 450,
            "workspaceZ": 350,
            "laserPower": "40",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272728",
            "fablabId": 4,
            "type": "lasercutter",
            "deviceName": "MARS-130",
            "manufacturer": "Thunderlaser",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272727",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "RD-Works",
            "workspaceX": 1500,
            "workspaceY": 900,
            "workspaceZ": 250,
            "laserPower": "100",
            "comment": "",
            "__v": 0
        }
    ]
}
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
 *   error: Error while trying to search for a specific lasercutter with query: {...},
 *   stack: {...}
 * }
 * @apiPermission none
*/
function search (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query);
  lasercutterService.getAll(req.body.query, req.body.limit, req.body.skip).then((lasercutters) => {
    if (lasercutters.length === 0) {
      logger.info(`POST search for lasercutters with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ lasercutters });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for lasercutters with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds partial results ${JSON.stringify(lasercutters)}`);
      res.status(206).send({ lasercutters });
    } else {
      logger.info(`POST search for lasercutters with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds results ${JSON.stringify(lasercutters)}`);
      res.status(200).send({ lasercutters });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific lasercutter with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific lasercutter with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
  });
}

/**
 * @api {post} /api/v1/machines/lasercutters/count Counts the Lasercutters
 * @apiName CountLasercutter
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Object} count the number of lasercutters
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *
{
    "count": 98
}
 * @apiPermission none
 */
function count (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query);
  lasercutterService.count(req.body.query).then((count) => {
    logger.info(`Count Lasercutters with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
}

/**
 * @api {get} /api/v1/machines/lasercutters/:id/countSuccessfulOrders
 * Counts the number of successful (representive and completed) orders of a Lasercutter by a given id
 * @apiName CountSuccessfulOrdersLaserCutter
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the lasercutter
 *
 * @apiSuccess {Object} machineId is the id of the lasercutter object
 * @apiSuccess {number} successfulOrders is the number of successful orders
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "machineId": "5b55f7bf3fe0c8b01713b3ee",
    "successfulOrders": 2
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
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Could not get successful orders for machine Id 9999""
 *     }
 *
 * @apiPermission none
 */
async function countSuccessfulOrders (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const successfulOrders = await machineService.countSuccessfulOrders(req.params.id);
    const orders = [];
    successfulOrders.forEach((order: { id: string, projectname: string }) => {
      orders.push({ id: order.id, projectname: order.projectname });
    });
    logger.info(`Successful Orders of machine with id ${req.param.id}: ${successfulOrders}`);
    return res.status(200).send({ machineId: req.params.id, orders, successfulOrders: successfulOrders.length });
  } catch (err) {
    const msg = { error: `Could not get successful orders for machine Id ${req.param.id}!`, stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

/**
 * @api {get} /api/v1/machines/lasercutters/laserTypes Get Lasertypes of Lasercutters
 * @apiName GetLaserTypes
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 *
 * @apiSuccess {Object} lasercutter the lasercutter object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "laserTypes": [
        {
            "_id": "5b55f7bf3fe0c8b01713b3dc",
            "laserType": "CO2",
            "__v": 0
        }
    ]
}

 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiPermission none
 */
function getLaserTypes (req, res) {
  lasercutterService.getLaserTypes().then((laserTypes) => {
    if (laserTypes && laserTypes.length === 0) {
      logger.info('GET Lasertypes with no result');
      res.status(204).send();
    } else if (laserTypes) {
      logger.info(`GET Lasertypes with result ${JSON.stringify(laserTypes)}`);
      res.status(200).send({ laserTypes });
    }
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
}

/**
 * @api {post} /api/v1/machines/lasercutters/ Create new Lasercutter
 * @apiName CreateNewLasercutter
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {Array} laserTypes array of laserType objects
 * @apiParam {Number} workspaceX space of axis x
 * @apiParam {Number} workspaceY space volume of axis y
 * @apiParam {Number} workspaceY space volume of axis z
 * @apiParam {Number} maxResoultion resolution of lasercutter
 * @apiParam {String} laserPower power of the laser
 * @apiParam {String} comment a comment about the device
 * @apiParamExample {json} Request-Example:
 *
{
  "fablabId": "5b453ddb5cf4a9574849e98a",
  "deviceName":"Test Lasercutter" ,
  "manufacturer": "Test Manufacturer" ,
  "laserTypes": [{
    "laserType": "CO2"
  }],
  "workspaceX": 2,
  "workspaceY": 2,
  "workspaceZ": 2,
  "maxResoultion": 2,
  "laserPower": "High",
  "comment": "Create Test"
}
 *
 * @apiSuccess {Object} lasercutter the lasercutter object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutter": {
        "_id": "5b571e4dfeb1a9647183fcd8",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Lasercutter",
        "manufacturer": "Test Manufacturer",
        "laserTypes": [
            {
                "laserType": "CO2"
            }
        ],
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "maxResoultion": 2,
        "laserPower": "High",
        "comment": "Create Test",
        "type": "lasercutter",
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
        "_message": "Lasercutter validation failed",
        "message": "Lasercutter validation failed: fablabId: Path `fablabId` is required.",
        "name": "ValidationError"
    }
}
 *
 * @apiPermission admin
 */
function create (req, res) {
  lasercutterService.create(req.body).then((lasercutter) => {
    logger.info(`POST Lasercutter with result ${JSON.stringify(lasercutter)}`);
    res.status(201).send({ lasercutter });
  }).catch((err) => {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
}

/**
 * @api {delete} /api/v1/machines/lasercutters/:id Deletes a Lasercutter by a given id
 * @apiName DeleteLasercutterById
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {id} is the id of the lasercutter
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
 * {
    "_id": "5b695b6ff371a21d0c858f2a",
    "fablabId": "5b453ddb5cf4a9574849e98a",
    "deviceName": "Test Lasercutter",
    "manufacturer": "Test Manufacturer",
    "activated": false,,
    "laserTypes": [
        {
            "_id": "5b695b6ff371a21d0c858f2b",
            "laserType": "CO2"
        }
    ],
    "workspaceX": 2,
    "workspaceY": 2,
    "workspaceZ": 2,
    "maxResoultion": 2,
    "laserPower": "High",
    "comment": "Create Test",
    "type": "lasercutter",
    "__v": 0
}
 *
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
 *

 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Malformed request!"
}

 * @apiError 404 Lasercutter not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "error: `Lasercutter by id 9999 not found!`"
}
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
    "error": "Error while trying to get the Lasercutter by id 9999",
}

 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
   "error": "Error while trying to delete the Lasercutter with id 9999"
}
 *
 * @apiPermission admin
 */
async function deleteById (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const l = await lasercutterService.get(req.params.id);
    if (l) {
      try {
        let result = await lasercutterService.deleteById(req.params.id);
        if (result) {
          try {
            result = await lasercutterService.get(req.params.id);
            if (result) {
              logger.info(`DELETE Lasercutter with result ${JSON.stringify(result)}`);
              return res.status(200).send({ lasercutter: result });
            }
            throw Error;
          } catch (err) {
            const msg = {
              err: `Error while trying to get the Lasercutter by id ${req.params.id}`,
              stack: err
            };
            logger.error(msg);
            return res.status(500).send(msg);
          }
        } else {
          const msg = { error: `Error while trying to delete the Lasercutter with id ${req.params.id}` };
          logger.error(msg);
          return res.status(500).send(msg);
        }
      } catch (err) {
        const msg = { error: 'Malformed request!', stack: err };
        logger.error(msg);
        return res.status(400).send(msg);
      }
    } else {
      const msg = { error: `Lasercutter by id ${req.params.id} not found!` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
  } catch (err) {
    const msg = { error: `Error while trying to get the Lasercutter by id ${req.params.id}`, stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

/**
 * @api {get} /api/v1/machines/lasercutters/:id Gets a Lasercutter by a given id
 * @apiName GetLasercutterById
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the lasercutter
 *
 * @apiSuccess {Object} lasercutter the lasercutter object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutter": {
        "_id": "5b62b46ea519361b031d51b8",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Lasercutter",
        "manufacturer": "Test Manufacturer",
        "laserTypes": [
            {
                "_id": "5b62b46ea519361b031d51b9",
                "laserType": "CO2"
            }
        ],
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "maxResoultion": 2,
        "laserPower": "High",
        "comment": "Create Test",
        "type": "lasercutter",
        "__v": 0
    }
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
 *
 * @apiError 404 The object was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Lasercutter by id '9999' not found"
 *     }
 *
 * @apiPermission none
 */
async function get (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const lasercutter = await lasercutterService.get(req.params.id);
    if (!lasercutter) {
      const msg = { error: `Lasercutter by id '${req.params.id}' not found` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
    logger.info(`GET LasercutterById with result ${JSON.stringify(lasercutter)}`);
    return res.status(200).send({ lasercutter });
  } catch (err) {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    return res.status(400).send(msg);
  }
}

/**
 * @api {put} /api/v1/machines/lasercutters/:id Updates a Lasercutter by a given id
 * @apiName UpdateLasercutterByID
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {id} is the id of the lasercutter
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {Array} laserTypes array of laserType objects
 * @apiParam {Number} workspaceX space of axis x
 * @apiParam {Number} workspaceY space volume of axis y
 * @apiParam {Number} workspaceY space volume of axis z
 * @apiParam {Number} maxResoultion resolution of lasercutter
 * @apiParam {String} laserPower power of the laser
 * @apiParam {String} comment a comment about the device
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66c55aab1b741fbbc2fd3c",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Updated",
    "manufacturer" : "Test Manufacturer",
    "laserTypes" : [
        {
            "_id" : "5b66c55aab1b741fbbc2fd3d",
            "laserType" : "CO2"
        }
    ],
    "workspaceX" : 2,
    "workspaceY" : 2,
    "workspaceZ" : 2,
    "maxResoultion" : 2,
    "laserPower" : "High",
    "comment" : "Create Test",
    "type" : "lasercutter",
    "__v" : 0
}
 * @apiSuccess {Object} lasercutter the lasercutter object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutter": {
        "_id": "5b66c55aab1b741fbbc2fd3c",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Updated",
        "manufacturer": "Test Manufacturer",
        "laserTypes": [
            {
                "_id": "5b66c55aab1b741fbbc2fd3d",
                "laserType": "CO2"
            }
        ],
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "maxResoultion": 2,
        "laserPower": "High",
        "comment": "Create Test",
        "type": "lasercutter",
        "__v": 0
    }
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
 *
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
 *       "error": "Lasercutter by id '9999' not found"
 *     }
 *
 * @apiPermission admin
 */
async function update (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  if (Object.keys(req.body).length === 0) {
    const msg = { error: 'No params to update given!' };
    logger.error(msg);
    return res.status(400).send(msg);
  }
  try {
    let lasercutter = await lasercutterService.get(req.params.id);
    if (!lasercutter) {
      const msg = { error: `Lasercutter by id '${req.params.id}' not found` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
    lasercutter = await lasercutterService.update(req.params.id, req.body);
    logger.info(`PUT Lasercutter with result ${JSON.stringify(lasercutter)}`);
    return res.status(200).send({ lasercutter });
  } catch (err) {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    return res.status(400).send(msg);
  }
}

/**
 * @api {get} /api/v1/machines/lasercutters/:id/schedules Gets the schedules of a specific lasercutter
 * @apiName getScheduleOfLasercutters
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the lasercutter (required)
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
                "type": "lasercutter",
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
                "type": "lasercutter",
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
 *       "error": "Error while trying to get schedules of Lasercutter!"
 *     }
 *
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
 *
 * @apiPermission none
 */
async function getSchedules (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const schedules = await machineService.getSchedules(req.params.id, req.query);
    logger.info(`GET schedules for Lasercutter with result ${JSON.stringify(schedules)}`);
    if (schedules.length) {
      return res.status(200).send({ schedules });
    }
    return res.status(204).send();
  } catch (err) {
    const msg = { error: 'Error while trying to get schedules of Lasercutter!' };
    logger.error({ msg, stack: err.stack });
    return res.status(500).send(msg);
  }
}

export default {
  getAll, create, getLaserTypes, deleteById, get, update, count, countSuccessfulOrders, getSchedules, search
};
