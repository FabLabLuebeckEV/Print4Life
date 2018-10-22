import * as express from 'express';
import otherMachineCtrl from '../controllers/otherMachine.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

/**
 * @api {get} /api/v1/machines/otherMachines Get other machines
 * @apiName GetOtherMachines
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
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
 */
router.route('/').get((req, res) => {
  req.query = validatorService.checkQuery(req.query);
  otherMachineCtrl.getAll(req.query.limit, req.query.skip).then((otherMachines) => {
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
});

/**
 * @api {get} /api/v1/machines/otherMachines/count Counts the Other Machines
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
 *
 */
router.route('/count').get((req, res) => {
  otherMachineCtrl.count().then((count) => {
    logger.info(`GET count other machines with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying to count other machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

/**
 * @api {post} /api/v1/machines/otherMachines/ Create new Other Machine
 * @apiName CreateNewOtherMachine
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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
 *
 */
router.route('/').post((req, res) => {
  otherMachineCtrl.create(req.body).then((otherMachine) => {
    logger.info(`POST Other Machine with result ${JSON.stringify(otherMachine)}`);
    res.status(201).send({ otherMachine });
  }).catch((err) => {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
});

/**
 * @api {delete} /api/v1/machines/otherMachines/:id Deletes a other Machine by a given id
 * @apiName DeleteOtherMachinesById
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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
    "manufacturer": "Test Manufacturer",
    "typeOfMachine": "Test Machine",
    "comment": "Create Test",
    "type": "otherMachine",
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
 *
 */
router.route('/:id').delete((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    let otherMachine;
    otherMachineCtrl.get(req.params.id).then((o) => {
      if (o) {
        otherMachine = o;
        otherMachineCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            otherMachineCtrl.get(req.params.id).then((result) => {
              if (!result) {
                logger.info(`DELETE Other Machine with result ${JSON.stringify(otherMachine)}`);
                res.status(200).send({ otherMachine });
              }
            }).catch((err) => {
              const msg = {
                err: `Error while trying to get the Other Machine by id ${req.params.id}`,
                stack: err
              };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = { error: `Error while trying to delete the Other Machine with id ${req.params.id}` };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { error: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { error: `Other Machine by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: `Error while trying to get the Other Machine by id ${req.params.id}`, stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

/**
 * @api {get} /api/v1/machines/otherMachines/:id Gets a Other Machine by a given id
 * @apiName GetOtherMachineById
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the other machine
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
 *       "error": "Other Machine by id '9999' not found"
 *     }
 *
 *
 */
router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    const msg = { error: checkId.error };
    logger.error(msg);
    res.status(checkId.status).send(msg);
  } else {
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        const msg = { error: `Other Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET Other Machine by Id with result ${JSON.stringify(otherMachine)}`);
        res.status(200).send({ otherMachine });
      }
    }).catch((err) => {
      const msg = { error: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
});

/**
 * @api {put} /api/v1/machines/otherMachines/:id Updates a Other Machine by a given id
 * @apiName UpdateOtherMachineByID
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the other machine
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
 *       "error": "Other Machine by id '9999' not found"
 *     }
 *
 *
 */
router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send({ error: 'No params to update given!' });
  } else {
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        const msg = { error: `Other Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        otherMachineCtrl.update(req.params.id, req.body).then((otherMachine) => {
          logger.info(`PUT Other Machine with result ${JSON.stringify(otherMachine)}`);
          res.status(200).send({ otherMachine });
        });
      }
    }).catch((err) => {
      const msg = { error: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
});


export default router;
