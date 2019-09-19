import validatorService from '../services/validator.service';
import logger from '../logger';
import ScheduleService from '../services/schedule.service';
import MachineService from '../services/machine.service';
import OrderService from '../services/order.service';
import UserService from '../services/user.service';

const scheduleService = new ScheduleService();
const machineService = new MachineService();
const orderService = new OrderService();
const userService = new UserService();

/**
 * @api {get} /api/v1/schedules/:id Request a schedule by its id
 * @apiName getScheduleById
 * @apiVersion 1.0.0
 * @apiGroup Schedules
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} id is the id of the schedule (required)
 * @apiSuccess { Object } schedule a single schedule
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "schedule": {
        "machine": {
            "type": "otherMachine",
            "id": "5b55f7bf3fe0c8b01713b3f2"
        },
        "_id": "5bfd4ff1cf880870552a846c",
        "startDate": "2018-11-27T13:28:32.000Z",
        "endDate": "2018-11-27T14:28:32.000Z",
        "fablabId": "5b453ddb5cf4a9574849e98c",
        "orderId": "5bfd430d3192b357d61f6d4c",
        "__v": 0
    }
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "Could not find any Schedule with id 9999"
  }
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get Schedule with id 9999"
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
 * @apiPermission loggedIn
 */
async function get (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const schedule = await scheduleService.get(req.params.id);
    if (!schedule) {
      logger.error({ error: `Could not find any Schedule with id ${req.params.id}` });
      return res.status(404).send({ error: `Could not find any Schedule with id ${req.params.id}` });
    }
    logger.info(`GET Schedule with result ${JSON.stringify(schedule)}`);
    return res.status(200).send({ schedule });
  } catch (err) {
    const error = `Error while trying to get Schedule with id ${req.params.id}`;
    logger.error({ error, stack: err });
    return res.status(500).send({ error });
  }
}

/**
 * @api {get} /api/v1/schedules/ Request the list of schedules
 * @apiName GetSchedules
 * @apiVersion 1.0.0
 * @apiGroup Schedules
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} schedules an array of schedule objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "schedules": [
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd468fd6b2e95e137bf484",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd46add6b2e95e137bf485",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd47486de674612d4a04cd",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd47a46de674612d4a04ce",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd4cdf18fd0c6bbd56e862",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd4d0a18fd0c6bbd56e863",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd4f14f14a446d68518377",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd4fd6cf880870552a846b",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd4ff1cf880870552a846c",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        }
    ]
}
* @apiSuccessExample Success-Response:
*    HTTP/1.1 204 No-Content
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get all schedules!"
  }
* @apiSuccessExample Success-Response:
*    HTTP/1.1 206 Partial Content
{
    "schedules": [
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd468fd6b2e95e137bf484",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd46add6b2e95e137bf485",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {
            "machine": {
                "type": "otherMachine",
                "id": "5b55f7bf3fe0c8b01713b3f2"
            },
            "_id": "5bfd47486de674612d4a04cd",
            "startDate": "2018-11-27T13:28:32.000Z",
            "endDate": "2018-11-27T14:28:32.000Z",
            "fablabId": "5b453ddb5cf4a9574849e98c",
            "orderId": "5bfd430d3192b357d61f6d4c",
            "__v": 0
        },
        {...}
    ]
}
* @apiPermission loggedIn
*/
function getAll (req, res) {
  req.query = validatorService.checkQuery(req.query);
  scheduleService.getAll(undefined, req.query.limit, req.query.skip).then((schedules) => {
    if (schedules.length === 0) {
      logger.info('GET Schedules without result');
      res.status(204).send();
    } else if (req.query.limit && req.query.skip) {
      logger.info(`GET Schedules with partial result ${JSON.stringify(schedules)}`);
      res.status(206).send({ schedules });
    } else {
      logger.info(`GET Schedules with results ${JSON.stringify(schedules)}`);
      res.status(200).send({ schedules });
    }
  }).catch((err) => {
    const error = 'Error while trying to get all schedules!';
    logger.error({ error, stack: err });
    res.status(500).send({ error });
  });
}

/**
 * @api {post} /api/v1/schedules/ Adds a new schedule
 * @apiName createSchedule
 * @apiVersion 1.0.0
 * @apiGroup Schedules
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {Date} startDate is the start date of the schedule for the order and machine (required)
 * @apiParam {Date} endDate is the end date of the schedule for the order and machine (required)
 * @apiParam {Object} machine is a simple machine object containing machineId and machine type (required)
 * @apiParam {String} fablabId is the id of the fablab of the machine (required)
 * @apiParam {String} orderId is the id of the order this schedule belongs to (required)
 *
 * @apiParamExample {json} Request-Example:
{
  "startDate": "Tue Nov 27 2018 17:28:32 GMT+0100 (CET)",
  "endDate": "Tue Nov 27 2018 18:28:32 GMT+0100 (CET)",
  "machine": {
    "type": "otherMachine",
    "id": "5b55f7bf3fe0c8b01713b3f2"
  },
  "fablabId": "5b453ddb5cf4a9574849e98c",
  "orderId":"5bfd430d3192b357d61f6d4c"
}
 *
 * @apiSuccess { Object } schedule the new schedule object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
{
    "schedule": {
        "_id": "5bfe726ea1353a1b64139ea4",
        "startDate": "2018-11-27T16:28:32.000Z",
        "endDate": "2018-11-27T17:28:32.000Z",
        "machine": {
            "type": "otherMachine",
            "id": "5b55f7bf3fe0c8b01713b3f2"
        },
        "fablabId": "5b453ddb5cf4a9574849e98c",
        "orderId": "5bfd430d3192b357d61f6d4c",
        "__v": 0
    }
}
  * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed schedule, one or more parameters wrong or missing"
  }
 * @apiPermission editor
 */
async function create (req, res) {
  const token = req.headers.authorization.split('JWT')[1].trim();
  const user = await userService.getUserByToken(token);

  if (user.role.role !== 'editor' && user.role.role !== 'admin') {
    const msg = {
      err: 'FORBIDDEN',
      message: 'User can not create schedules!'
    };

    return res.status(403).send(msg);
  }
  try {
    if (req.body.startDate && req.body.endDate && req.body.machine) {
      await scheduleService.checkDateTime({ id: req.params.id, ...req.body });
    }
  } catch (err) {
    logger.error({ error: err.message, stack: err });
    return res.status(400).send({ error: err.message });
  }

  try {
    const schedule = await scheduleService.create(req.body);
    const order = await orderService.get(req.body.orderId);
    order.machine.schedule = { id: schedule.id, startDate: schedule.startDate, endDate: schedule.endDate };
    await orderService.update(order);
    const machine = await machineService.get(schedule.machine.type, schedule.machine.id);
    if (!machine.schedules.includes(schedule.id)) {
      machine.schedules.push(schedule.id);
      machineService.update(schedule.machine.type, schedule.machine.id, machine);
    }
    logger.info(`POST Schedule with result ${JSON.stringify(schedule)}`);
    return res.status(201).send({ schedule });
  } catch (err) {
    const error = 'Malformed schedule, one or more parameters wrong or missing';
    logger.error({ error, stack: err });
    return res.status(400).send({ error });
  }
}

/**
 * @api {put} /api/v1/schedules/:id Updates a schedule or creates it, if it doesn't exists yet.
 * @apiName updateSchedule
 * @apiVersion 1.0.0
 * @apiGroup Schedules
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} id is the id of the schedule (required)
 * @apiParam {Date} startDate is the start date of the schedule for the order and machine
 * @apiParam {Date} endDate is the end date of the schedule for the order and machine
 * @apiParam {Object} machine is a simple machine object containing machineId and machine type
 * @apiParam {String} fablabId is the id of the fablab of the machine
 * @apiParam {String} orderId is the id of the order this schedule belongs to
 *
 * @apiParamExample {json} Request-Example:
{
  "startDate": "Tue Nov 27 2018 11:25:32 GMT+0100 (CET)",
  "endDate": "Tue Nov 27 2018 11:45:32 GMT+0100 (CET)",
  "machine": {
    "type": "otherMachine",
    "id": "5b55f7bf3fe0c8b01713b3f2"
  },
  "fablabId": "5b453ddb5cf4a9574849e98c",
  "orderId":"5bfd430d3192b357d61f6d4c"
}
 * @apiSuccess { Object } schedule the updated schedule
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "schedule": {
        "machine": {
            "type": "otherMachine",
            "id": "5b55f7bf3fe0c8b01713b3f2"
        },
        "_id": "5bfe726ea1353a1b64139ea4",
        "startDate": "2018-11-27T10:25:32.000Z",
        "endDate": "2018-11-27T10:45:32.000Z",
        "fablabId": "5b453ddb5cf4a9574849e98c",
        "orderId": "5bfd430d3192b357d61f6d4c",
        "__v": 0
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed update."
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
    "error": "Schedules Dates are between another schedule for the machine 5b55f7bf3fe0c8b01713b3f2"
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
 * @apiPermission editor
 */
async function update (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    if (req.body.startDate && req.body.endDate && req.body.machine) {
      await scheduleService.checkDateTime({ id: req.params.id, ...req.body });
    }
  } catch (err) {
    logger.error({ error: err.message, stack: err });
    return res.status(400).send({ error: err.message });
  }

  try {
    let schedule = await scheduleService.get(req.params.id);
    const oldOrder = await orderService.get(schedule.orderId);
    delete oldOrder.machine.schedule;
    await orderService.update(oldOrder);
    // old machine is changed in schedule
    if (req.body.machine.type && req.body.machine.id) {
      const oldMachine = await machineService.get(schedule.machine.type, schedule.machine.id);
      if (schedule.machine.type !== req.body.machine.type || schedule.machine.id !== req.body.machine.id) {
        oldMachine.schedules = oldMachine.schedules.filter((e) => e !== schedule.id);
        machineService.update(schedule.machine.type, schedule.machine.id, oldMachine);
      }
    }
    schedule = await scheduleService.update(req.params.id, req.body);
    const machine = await machineService.get(schedule.machine.type, schedule.machine.id);
    if (!machine.schedules.includes(schedule.id)) {
      machine.schedules.push(schedule.id);
      machineService.update(schedule.machine.type, schedule.machine.id, machine);
    }
    const order = await orderService.get(schedule.orderId);
    order.machine.schedule = { id: schedule.id, startDate: schedule.startDate, endDate: schedule.endDate };
    await orderService.update(order);
    logger.info(`PUT Schedule with result ${JSON.stringify(schedule)}`);
    return res.status(200).send({ schedule });
  } catch (err) {
    const error = 'Malformed update.';
    logger.error({ error, stack: err });
    return res.status(400).send({ error });
  }
}

/**
 * @api {delete} /api/v1/schedules/:id Deletes a schedule
 * @apiName deleteSchedule
 * @apiVersion 1.0.0
 * @apiGroup Schedules
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Object } schedule the deleted schedule
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "schedule": {
        "machine": {
            "type": "otherMachine",
            "id": "5b55f7bf3fe0c8b01713b3f2"
        },
        "_id": "5bfe726ea1353a1b64139ea4",
        "startDate": "2018-11-27T10:25:32.000Z",
        "endDate": "2018-11-27T10:45:32.000Z",
        "fablabId": "5b453ddb5cf4a9574849e98c",
        "orderId": "5bfd430d3192b357d61f6d4c",
        "__v": 0
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed Request!"
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
 * @apiPermission editor
 */
async function deleteById (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const oldSchedule = await scheduleService.get(req.params.id);
    const schedule = await scheduleService.deleteById(req.params.id);
    const order = await orderService.get(oldSchedule.orderId);
    delete order.machine.schedule;
    await orderService.update(order);
    const machine = await machineService.get(schedule.machine.type, schedule.machine.id);
    machine.schedules = machine.schedules.filter((e) => e !== oldSchedule.id);
    machineService.update(oldSchedule.machine.type, oldSchedule.machine.id, machine);
    logger.info(`DELETE Schedule with result ${JSON.stringify(schedule)}`);
    return res.status(200).send({ schedule });
  } catch (err) {
    const error = 'Malformed Request!';
    logger.error({ error, stack: err });
    return res.status(400).send({ error });
  }
}

export default {
  get, getAll, create, update, deleteById
};
