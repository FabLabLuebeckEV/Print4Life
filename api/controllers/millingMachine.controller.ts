import { MachineService } from '../services/machine.service';
import logger from '../logger';
import validatorService from '../services/validator.service';

const machineType = 'millingMachine';

const machineService = new MachineService();

/**
 * @api {get} /api/v1/machines/millingMachines Get milling machines
 * @apiName GetMillingMachines
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} millingMachines an array of milling machine objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "millingMachines": [
        {
            "_id": "5b51c25c1058dc218927272e",
            "fablabId": 3,
            "type": "millingMachine",
            "deviceName": "High-Z S-720T",
            "manufacturer": "CNC-Step",
            "camSoftware": "",
            "workspaceX": 720,
            "workspaceY": 420,
            "workspaceZ": 110,
            "movementSpeed": 0,
            "stepSize": null,
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc218927272d",
            "fablabId": 2,
            "type": "millingMachine",
            "deviceName": "PRSALPHA",
            "manufacturer": "SHOPBOT",
            "camSoftware": "",
            "workspaceX": 2550,
            "workspaceY": 1500,
            "workspaceZ": 200,
            "movementSpeed": 12000,
            "stepSize": null,
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
    "millingMachines": [
        {
            "_id": "5b51c25c1058dc218927272e",
            "fablabId": 3,
            "type": "millingMachine",
            "deviceName": "High-Z S-720T",
            "manufacturer": "CNC-Step",
            "camSoftware": "",
            "workspaceX": 720,
            "workspaceY": 420,
            "workspaceZ": 110,
            "movementSpeed": 0,
            "stepSize": null,
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b51c25c1058dc218927272d",
            "fablabId": 2,
            "type": "millingMachine",
            "deviceName": "PRSALPHA",
            "manufacturer": "SHOPBOT",
            "camSoftware": "",
            "workspaceX": 2550,
            "workspaceY": 1500,
            "workspaceZ": 200,
            "movementSpeed": 12000,
            "stepSize": null,
            "comment": "",
            "__v": 0
        }
    ]
}
 */
function getAll (req, res) {
  req.query = validatorService.checkQuery(req.query);
  _getAll(req.query.limit, req.query.skip).then((millingMachines) => {
    if ((millingMachines && millingMachines.length === 0) || !millingMachines) {
      logger.info('GET Milling Machines with no result');
      res.status(204).send();
    } else if (millingMachines && req.query.limit && req.query.skip) {
      logger.info(`GET Milling Machines with partial result ${JSON.stringify(millingMachines)}`);
      res.status(206).send({ millingMachines });
    } else if (millingMachines) {
      logger.info(`GET Milling Machines with result ${JSON.stringify(millingMachines)}`);
      res.status(200).send({ millingMachines });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all milling machines!', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {get} /api/v1/machines/millingMachines/count Counts the Milling Machines
 * @apiName CountMillingMachine
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Object} count the number of milling machines
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *
{
    "count": 98
}
 *
 */
function count (req, res) {
  _count().then((count) => {
    logger.info(`GET count milling machines with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying to count milling machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {post} /api/v1/machines/millingMachines/ Create new Milling Machine
 * @apiName CreateNewMillingMachine
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {String} camSoftware name of the camera software
 * @apiParam {Number} workspaceX space of axis x
 * @apiParam {Number} workspaceY space volume of axis y
 * @apiParam {Number} workspaceY space volume of axis z
 * @apiParam {Number} movementSpeed speed of the milling machine
 * @apiParam {String} stepSize size of the steps
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
 * @apiSuccess {Object} millingMachine the milling machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "millingMachine": {
        "_id": "5b57234cb25dad6d0f95b7a7",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Milling Machine",
        "manufacturer": "Test Manufacturer",
        "camSoftware": "Test Cam Software",
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "movementSpeed": 2,
        "stepSize": 2,
        "comment": "Create Test",
        "type": "millingMachine",
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
        "_message": "MillingMachine validation failed",
        "message": "MillingMachine validation failed: fablabId: Path `fablabId` is required.",
        "name": "ValidationError"
    }
}
 *
 *
 */
function create (req, res) {
  _create(req.body).then((millingMachine) => {
    logger.info(`POST Milling Machine with result ${JSON.stringify(millingMachine)}`);
    res.status(201).send({ millingMachine });
  }).catch((err) => {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
}

/**
 * @api {delete} /api/v1/machines/millingMachines/:id Deletes a Milling Machine by a given id
 * @apiName DeleteMillingMachineById
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the milling machine
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
 * {
    "_id": "5b6ab21499f236256541caf7",
    "fablabId": "5b453ddb5cf4a9574849e98a",
    "deviceName": "Test Milling Machine",
    "manufacturer": "Test Manufacturer",
    "activated": false,
    "workspaceX": 2,
    "workspaceY": 2,
    "workspaceZ": 2,
    "comment": "Create Test",
    "type": "millingMachine",
    "__v": 0
}
 *
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

 * @apiError 404 Milling Machine not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "error: `Milling Machine by id 9999 not found!`"
}
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
    "error": "Error while trying to get the Milling Machine by id 9999",
}

 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
   "error": "Error while trying to delete the Milling Machine with id 9999"
}
 *
 *
 */
function deleteById (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    let millingMachine;
    _get(req.params.id).then((m) => {
      if (m) {
        millingMachine = m;
        _deleteById(req.params.id).then((result) => {
          if (result) {
            _get(req.params.id).then((result) => {
              if (result) {
                logger.info(`DELETE Milling Machine with result ${JSON.stringify(millingMachine)}`);
                res.status(200).send({ millingMachine: result });
              }
            }).catch((err) => {
              const msg = {
                err: `Error while trying to get the Milling Machine by id ${req.params.id}`,
                stack: err
              };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = {
              error: `Error while trying to delete the Milling Machine with id ${req.params.id}`
            };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { error: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { error: `Milling Machine by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = {
        error: `Error while trying to get the Milling Machine by id ${req.params.id}`, stack: err
      };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
}

/**
 * @api {get} /api/v1/machines/millingMachines/:id Gets a Milling Machine by a given id
 * @apiName GetMillingMachineById
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the milling machine
 *
 * @apiSuccess {Object} millingMachine the milling machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "millingMachine": {
        "_id": "5b62bd1c41736630fde4d2f2",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Milling Machine",
        "manufacturer": "Test Manufacturer",
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "comment": "Create Test",
        "type": "millingMachine",
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
 *       "error": "Milling Machine by id '9999' not found"
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
    _get(req.params.id).then((millingMachine) => {
      if (!millingMachine) {
        const msg = { error: `Milling Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET Milling Machine by id with result ${JSON.stringify(millingMachine)}`);
        res.status(200).send({ millingMachine });
      }
    }).catch((err) => {
      const msg = { error: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
}

/**
 * @api {put} /api/v1/machines/millingMachines/:id Updates a Milling Machine by a given id
 * @apiName UpdateMillingMachineByID
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the milling machine
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {String} camSoftware name of the camera software
 * @apiParam {Number} workspaceX space of axis x
 * @apiParam {Number} workspaceY space volume of axis y
 * @apiParam {Number} workspaceY space volume of axis z
 * @apiParam {Number} movementSpeed speed of the milling machine
 * @apiParam {String} stepSize size of the steps
 * @apiParam {String} comment a comment about the device
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66c32d12e78b1ba254824e",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Updated",
    "manufacturer" : "Test Manufacturer",
    "workspaceX" : 2,
    "workspaceY" : 2,
    "workspaceZ" : 2,
    "comment" : "Create Test",
    "type" : "millingMachine",
    "__v" : 0
}
 * @apiSuccess {Object} millingMachine the milling machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "millingMachine": {
        "_id": "5b66c32d12e78b1ba254824e",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Updated",
        "manufacturer": "Test Manufacturer",
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "comment": "Create Test",
        "type": "millingMachine",
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
 *       "error": "Milling Machine by id '9999' not found"
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
    _get(req.params.id).then((millingMachine) => {
      if (!millingMachine) {
        const msg = { error: `Milling Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        _update(req.params.id, req.body).then((millingMachine) => {
          logger.info(`PUT Milling Machine with result ${JSON.stringify(millingMachine)}`);
          res.status(200).send({ millingMachine });
        });
      }
    }).catch((err) => {
      const msg = { error: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
}


/**
 * @api {get} /api/v1/machines/millingMachines/:id/countSuccessfulOrders
 * Counts the number of successful (representive and completed) orders of a Milling Machine by a given id
 * @apiName CountSuccessfulOrdersMilingMachine
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the milling machine
 *
 * @apiSuccess {Object} machineId is the id of the milling machine object
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

function _getAll (limit?: string, skip?: string) {
  let l: Number;
  let s: Number;
  if (limit && skip) {
    l = Number.parseInt(limit, 10);
    s = Number.parseInt(skip, 10);
  }
  return machineService.getMachineType(machineType, l, s);
}

function _create (params) {
  return machineService.create(machineType, params);
}

function _get (id) {
  return machineService.get(machineType, id);
}

function _deleteById (id) {
  return machineService.deleteById(machineType, id);
}

function _update (id, machine) {
  return machineService.update(machineType, id, machine);
}

function _count () {
  return machineService.count(machineType);
}

export default {
  getAll, create, get, deleteById, update, count, countSuccessfulOrders
};
