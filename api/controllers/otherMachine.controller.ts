import validatorService from '../services/validator.service';
import logger from '../logger';
import OtherMachineService from '../services/otherMachine.service';
import MachineService from '../services/machine.service';

const otherMachineService = new OtherMachineService();

const machineService = new MachineService();

/**
 * @api {get} /api/v1/machines/otherMachines Get other machines
 * @apiName GetOtherMachines
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) query is a mongodb query expression
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} otherMachines an array of other machine objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachines": [
        {
            "_id": "5b51c25c1058dc218927273e",
            "fablabId": 2,
            "type": "otherMachine",
            "deviceName": "Sign Maker BN-20",
            "manufacturer": "Roland",
            "typeOfMachine": "Cutting Plotter",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272742",
            "fablabId": 3,
            "type": "otherMachine",
            "deviceName": "NAO",
            "manufacturer": "Softbank Robotics",
            "typeOfMachine": "Humanoid Robot",
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
    "otherMachines": [
        {
            "_id": "5b51c25c1058dc218927273e",
            "fablabId": 2,
            "type": "otherMachine",
            "deviceName": "Sign Maker BN-20",
            "manufacturer": "Roland",
            "typeOfMachine": "Cutting Plotter",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272742",
            "fablabId": 3,
            "type": "otherMachine",
            "deviceName": "NAO",
            "manufacturer": "Softbank Robotics",
            "typeOfMachine": "Humanoid Robot",
            "comment": "",
            "__v": 0
        }
    ]
}
 * @apiPermission none
 */
function getAll (req, res) {
  req.query = validatorService.checkQuery(req.query);
  otherMachineService.getAll(req.query.query, req.query.limit, req.query.skip).then((otherMachines) => {
    if ((otherMachines && otherMachines.length === 0) || !otherMachines) {
      logger.info('GET Other Machines with no result');
      res.status(204).send();
    } else if (otherMachines && req.query.limit && req.query.skip) {
      logger.info(`GET Other Machines with partial result ${JSON.stringify(otherMachines)}`);
      res.status(206).send({ otherMachines });
    } else if (otherMachines) {
      logger.info(`GET Other Machines with result ${JSON.stringify(otherMachines)}`);
      res.status(200).send({ otherMachines });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all Other Machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {post} /api/v1/otherMachines/search Request the list of other machines by a given query
 * @apiName SearchOtherMachines
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} users an array of other machine objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachines": [
        {
            "_id": "5b51c25c1058dc218927273e",
            "fablabId": 2,
            "type": "otherMachine",
            "deviceName": "Sign Maker BN-20",
            "manufacturer": "Roland",
            "typeOfMachine": "Cutting Plotter",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272742",
            "fablabId": 3,
            "type": "otherMachine",
            "deviceName": "NAO",
            "manufacturer": "Softbank Robotics",
            "typeOfMachine": "Humanoid Robot",
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
    "otherMachines": [
        {
            "_id": "5b51c25c1058dc218927273e",
            "fablabId": 2,
            "type": "otherMachine",
            "deviceName": "Sign Maker BN-20",
            "manufacturer": "Roland",
            "typeOfMachine": "Cutting Plotter",
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc2189272742",
            "fablabId": 3,
            "type": "otherMachine",
            "deviceName": "NAO",
            "manufacturer": "Softbank Robotics",
            "typeOfMachine": "Humanoid Robot",
            "comment": "",
            "__v": 0
        }
    ]
}
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
 *   error: Error while trying to search for a specific other machine with query: {...},
 *   stack: {...}
 * }
 * @apiPermission none
*/
function search (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query);
  otherMachineService.getAll(req.body.query, req.body.limit, req.body.skip).then((otherMachines) => {
    if (otherMachines.length === 0) {
      logger.info(`POST search for other machines with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ otherMachines });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for other machines with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds partial results ${JSON.stringify(otherMachines)}`);
      res.status(206).send({ otherMachines });
    } else {
      logger.info(`POST search for other machines with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds results ${JSON.stringify(otherMachines)}`);
      res.status(200).send({ otherMachines });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific other machine with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific other machine with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
  });
}

/**
 * @api {post} /api/v1/machines/otherMachines/count Counts the Other Machines
 * @apiName CountOtherMachines
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Object} count the number of other machines
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
  otherMachineService.count(req.body.query).then((count) => {
    logger.info(`GET count other machines with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying to count other machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {get} /api/v1/machines/otherMachines/:id/countSuccessfulOrders
 * Counts the number of successful (representive and completed) orders of a other Machine by a given id
 * @apiName CountSuccessfulOrdersOtherMachine
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the other machine
 *
 * @apiSuccess {Object} machineId is the id of the other machine object
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
 * @api {post} /api/v1/machines/otherMachines/ Create new Other Machine
 * @apiName CreateNewOtherMachine
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {String} typeOfMachine the type of the machine
 * @apiParam {String} comment a comment about the device
 * @apiParamExample {json} Request-Example:
 *
{
  "fablabId": "5b453ddb5cf4a9574849e98a",
  "deviceName":"Test Milling Machine" ,
  "manufacturer": "Test Manufacturer" ,
  "camSoftware": "Test Cam Software",
  "workspaceX": 2,
  "workspaceY": 2,
  "workspaceZ": 2,
  "movementSpeed": 2,
  "stepSize": 2,
  "comment": "Create Test"
}
 *
 * @apiSuccess {Object} otherMachine the other machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachine": {
        "_id": "5b572744b5de46745af5e262",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Milling Machine",
        "manufacturer": "Test Manufacturer",
        "typeOfMachine": "Other Test Machine",
        "comment": "Create Test",
        "type": "otherMachine",
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
        "_message": "OtherMachine validation failed",
        "message": "OtherMachine validation failed: fablabId: Path `fablabId` is required.",
        "name": "ValidationError"
    }
}
 *
 * @apiPermission admin
 */
function create (req, res) {
  otherMachineService.create(req.body).then((otherMachine) => {
    logger.info(`POST Other Machine with result ${JSON.stringify(otherMachine)}`);
    res.status(201).send({ otherMachine });
  }).catch((err) => {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
}

/**
 * @api {delete} /api/v1/machines/otherMachines/:id Deletes a other Machine by a given id
 * @apiName DeleteOtherMachinesById
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {id} is the id of the other machine
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
 *
 * {
    "_id": "5b66fefec92bc40cd9dcfef3",
    "fablabId": "5b453ddb5cf4a9574849e98a",
    "deviceName": "Updated",
    "activated": false,
    "manufacturer": "Test Manufacturer",
    "typeOfMachine": "Test Machine",
    "comment": "Create Test",
    "type": "otherMachine",
    "__v": 0
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
    "error": "Malformed request!"
}

 * @apiError 404 Other Machine not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "error: `Other Machine by id 9999 not found!`"
}
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
    "error": "Error while trying to get the Other Machine by id 9999",
}

 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
   "error": "Error while trying to delete the Other Machine with id 9999"
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
  let otherMachine;
  try {
    const o = await otherMachineService.get(req.params.id);
    if (o) {
      otherMachine = o;
      try {
        let result = await otherMachineService.deleteById(req.params.id);
        if (result) {
          try {
            result = await otherMachineService.get(req.params.id);
            if (result) {
              logger.info(`DELETE Other Machine with result ${JSON.stringify(otherMachine)}`);
              return res.status(200).send({ otherMachine: result });
            }
            throw Error;
          } catch (err) {
            const msg = {
              err: `Error while trying to get the Other Machine by id ${req.params.id}`,
              stack: err
            };
            logger.error(msg);
            return res.status(500).send(msg);
          }
        } else {
          const msg = { error: `Error while trying to delete the Other Machine with id ${req.params.id}` };
          logger.error(msg);
          return res.status(500).send(msg);
        }
      } catch (err) {
        const msg = { error: 'Malformed request!', stack: err };
        logger.error(msg);
        return res.status(400).send(msg);
      }
    } else {
      const msg = { error: `Other Machine by id ${req.params.id} not found!` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
  } catch (err) {
    const msg = { error: `Error while trying to get the Other Machine by id ${req.params.id}`, stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

/**
 * @api {get} /api/v1/machines/otherMachines/:id Gets a Other Machine by a given id
 * @apiName GetOtherMachineById
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the other machine
 *
 * @apiSuccess {Object} otherMachine the milling machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachine": {
        "_id": "5b61abb7c3f4261df9ce7673",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Other Machine",
        "manufacturer": "Test Manufacturer",
        "typeOfMachine": "Test Machine",
        "comment": "Create Test",
        "type": "otherMachine",
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
 *       "error": "Other Machine by id '9999' not found"
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
    const otherMachine = await otherMachineService.get(req.params.id);
    if (!otherMachine) {
      const msg = { error: `Other Machine by id '${req.params.id}' not found` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
    logger.info(`GET Other Machine by Id with result ${JSON.stringify(otherMachine)}`);
    return res.status(200).send({ otherMachine });
  } catch (err) {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    return res.status(400).send(msg);
  }
}

/**
 * @api {put} /api/v1/machines/otherMachines/:id Updates a Other Machine by a given id
 * @apiName UpdateOtherMachineByID
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} id is the id of the other machine
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {String} typeOfMachine the type of the machine
 * @apiParam {String} comment a comment about the device
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66bbf95772aa134cf70d69",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Updated",
    "manufacturer" : "Test Manufacturer",
    "typeOfMachine" : "Test Machine",
    "comment" : "Create Test",
    "type" : "otherMachine",
    "__v" : 0
}
 * @apiSuccess {Object} otherMachine the other machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachine": {
        "_id": "5b66bbf95772aa134cf70d69",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Updated",
        "manufacturer": "Test Manufacturer",
        "typeOfMachine": "Test Machine",
        "comment": "Create Test",
        "type": "otherMachine",
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
 *       "error": "Other Machine by id '9999' not found"
 *     }
 *
 * @apiPermission admin
 */
async function update (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  } if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ error: 'No params to update given!' });
  }
  try {
    let otherMachine = await otherMachineService.get(req.params.id);
    if (!otherMachine) {
      const msg = { error: `Other Machine by id '${req.params.id}' not found` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
    otherMachine = await otherMachineService.update(req.params.id, req.body);
    logger.info(`PUT Other Machine with result ${JSON.stringify(otherMachine)}`);
    return res.status(200).send({ otherMachine });
  } catch (err) {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    return res.status(400).send(msg);
  }
}

/**
 * @api {get} /api/v1/machines/otherMachines/:id/schedules Gets the schedules of a specific other machine
 * @apiName getSchedulesOfOtherMachine
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the other machine (required)
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
                "type": "otherMachine",
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
                "type": "otherMachine",
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
 *       "error": "Error while trying to get schedules of Other Machine!"
 *     }
 *
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
    logger.info(`GET schedules for Other Machine with result ${JSON.stringify(schedules)}`);
    if (schedules.length) {
      return res.status(200).send({ schedules });
    }
    return res.status(204).send();
  } catch (err) {
    const msg = { error: 'Error while trying to get schedules of Other Machine!' };
    logger.error({ msg, stack: err.stack });
    return res.status(500).send(msg);
  }
}

export default {
  getAll, create, get, deleteById, update, count, countSuccessfulOrders, getSchedules, search
};
