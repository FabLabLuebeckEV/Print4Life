/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { IError, ErrorType } from '../services/router.service';
import { IoTDeviceService } from '../services/iot-device.service';
import { searchableTextFields } from '../models/iot-device.model';
import logger from '../logger';
import UserService from '../services/user.service';
import IBMWatsonService from '../services/ibm.watson.service';
import validatorService from '../services/validator.service';
import config from '../config/config';
/* eslint-enable no-unused-vars */

const iotDeviceService = new IoTDeviceService();
const userService = new UserService();
const ibmWatsonService = new IBMWatsonService();

/**
 * @api {get} /api/v1/iot-devices/:id gets an iot device by its id
 * @apiName getIoTDeviceById
 * @apiVersion 1.0.0
 * @apiGroup Iot-Devices
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Object } iot-device the iot device object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "iot-device": {
        "clientId": "d:tcccti:Sensor:Sensor-Test-2",
        "deviceType": "Sensor",
        "deviceId": "Sensor-Test-2",
        "deviceInfo": {},
        "events": [
            {
                "topic": "Event_1",
                "dataformat": "json"
            },
            {
                "topic": "Event_2",
                "dataformat": "json"
            }
        ]
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "name": "INVALID_ID",
      "message": "Invalid ID! IoT Device not found!",
      "type": 11,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Error while trying to get the iot device!",
      "type": 13,
      "stack": {...}, // optional
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request! JWT Token does not match a user or the user has no iot credentials",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request! Please provide a valid JWT Token
      in the Authorization header and an id of the iot device!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 */
async function get(req: Request, res: Response) {
  let error: IError;
  const user = await getUser(req);
  if (user.error) {
    return res.status(400).send(user.error);
  }
  if (req.params.id) {
    try {
      if (user && user.iot && user.iot.auth && user.iot.auth.key && user.iot.auth.token) {
        const apiKey = {
          key: user.iot.auth.key,
          token: user.iot.auth.token
        };
        const iotDevice: any = await iotDeviceService.get(req.params.id);
        if (iotDevice) {
          const result = await ibmWatsonService.getDevice(iotDevice.deviceId, iotDevice.deviceType, apiKey);
          if (result) {
            const retIoTDevice = {
              clientId: result.clientId,
              deviceType: result.typeId,
              deviceId: result.deviceId,
              deviceInfo: result.deviceInfo,
              events: iotDevice.events
            };
            logger.info(`GET iot device with result ${JSON.stringify(retIoTDevice)}`);
            return res.status(200).send({ 'iot-device': retIoTDevice });
          }
          logger.info(`GET iot device with empty result`);
          return res.status(204).send();
        }
        error = {
          name: 'INVALID_ID',
          message: 'Invalid ID! IoT Device not found!',
          type: ErrorType.INVALID_ID
        };
        logger.error(error);
        return res.status(404).send(error);
      }
      error = {
        name: 'MALFORMED_REQUEST',
        message: 'Malformed Request! JWT Token does not match a user or the user has no iot credentials!',
        type: ErrorType.MALFORMED_REQUEST
      };
      logger.error(error);
      return res.status(400).send(error);
    } catch (err) {
      error = {
        name: 'SERVER_ERROR',
        message: 'Error while trying to get the iot device!',
        type: ErrorType.SERVER_ERROR,
        stack: err && err.message ? err.message : ''
      };
      logger.error(error);
      return res.status(500).send(error);
    }
  }
  error = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! Please provide a valid JWT Token'
      + ' in the Authorization header and an id of the iot device!',
    type: ErrorType.MALFORMED_REQUEST
  };
  logger.error(error);
  return res.status(400).send(error);
}

/**
 * @api {post} /api/v1/iot-devices/ Adds a new iot device
 * @apiName createIoTDevice
 * @apiVersion 1.0.0
 * @apiGroup IoT-Devices
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} deviceType is the type of the device (required)
 * @apiParam {String} deviceId is the unique id for the device (required)
 * @apiParam {Array} events is an array of event objects {"topic": "Event_1", "dataformat": "json"} (required)
 *
 * @apiParamExample {json} Request-Example:
{
  "deviceType": "Sensor",
  "deviceId": "Sensor-Test-23",
  "events": [
    {"topic": "Event_1", "dataformat": "json"},
    {"topic": "Event_2", "dataformat": "json"}
  ]
}
 * @apiSuccess { Object } iot-device the new iot device object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
{
    "iot-device": {
        "username": "use-auth-token",
        "_id": "5c46eb14e2dfc2314a7269a0",
        "clientId": "d:tcccti:Sensor:Sensor-Test-24",
        "deviceType": "Sensor",
        "deviceId": "Sensor-Test-24",
        "password": "C3T0G?Y(ljWUeQEkAa",
        "events": [
            {
                "topic": "Event_1",
                "dataformat": "json"
            },
            {
                "topic": "Event_2",
                "dataformat": "json"
            }
        ],
        "__v": 0
    }
}

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
    "name": "SERVER_ERROR",
    "message": "Error while trying to create a new IoT Device!",
    "type": 13,
    "stack": {...}, // optional
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
    "name": "SERVER_ERROR",
    "message": "User has no credentials for iot devices!",
    "type": 13,
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
    "name": "SERVER_ERROR",
    "message": "Error while trying to save the user!",
    "type": 13,
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "name": "IOT_DEVICE_EXISTS",
    "message": "The IoT Device already exists. Please choose another DeviceId!",
    "type": 15,
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "name": "INVALID_ID",
    "message": "User does not exist!",
    "type": 11,
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "name": "MALFORMED_REQUEST",
    "message": "Malformed Request! Please provide a valid JWT Token on the Authorization Header,
    and a body with deviceType, deviceId and events. See ApiDocs for more Information!",
    "type": 14,
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}
 */
async function create(req: Request, res: Response) {
  let error: IError;
  const user = await getUser(req);
  if (user.error) {
    return res.status(400).send(user.error);
  }
  if (req.body.deviceType && req.body.deviceId && req.body.events && req.body.events.length) {
    try {
      if (user) {
        if (!user.iot || !user.iot.auth || !user.iot.auth.key || !user.iot.auth.token) {
          const apiKey = await ibmWatsonService.createAPIKey(
            { key: config.ibmWatson.key, token: config.ibmWatson.token },
            user.username
          );
          if (apiKey) {
            if (!user.iot) {
              user.iot = {
                devices: [],
                auth: {
                  key: '',
                  token: '',
                  roles: []
                }
              };
            }
            if (user.iot && !user.iot.auth) {
              user.iot.auth = {
                key: '',
                token: '',
                roles: []
              };
            }
            user.iot.auth.key = apiKey.key;
            user.iot.auth.token = apiKey.token;
            user.iot.auth.roles = apiKey.roles;
            try {
              await userService.update(user);
            } catch (err) {
              const error: IError = {
                name: 'SERVER_ERROR',
                message: 'Error while trying to save the user!',
                type: ErrorType.SERVER_ERROR,
                stack: err && err.message ? err.message : ''
              };
              logger.error(error);
              return res.status(500).send(error);
            }
          }
        }

        if (user.iot.auth.key && user.iot.auth.token) {
          const device = await iotDeviceService.getAll({ deviceId: req.body.deviceId }, '1', '0');
          if (device && device.length) {
            error = {
              name: 'IOT_DEVICE_EXISTS',
              message: 'The IoT Device already exists. Please choose another DeviceId!',
              type: ErrorType.IOT_DEVICE_EXISTS
            };
            logger.error(error);
            return res.status(400).send(error);
          }
          let result;
          try {
            result = await ibmWatsonService.createDevice(
              req.body.deviceType, req.body.deviceId, req.body.deviceInfo, {
                key: user.iot.auth.key, token: user.iot.auth.token
              }
            );
          } catch (err) {
            error = {
              name: 'IOT_DEVICE_EXISTS',
              message: 'The IoT Device already exists. Please choose another DeviceId!',
              type: ErrorType.IOT_DEVICE_EXISTS
            };
            logger.error(error);
            return res.status(400).send(error);
          }
          if (result) {
            const iotDevice = await iotDeviceService.create(
              {
                clientId: result.clientId,
                deviceType: result.typeId,
                deviceId: result.deviceId,
                password: result.authToken,
                events: req.body.events,
                deviceInfo: result.deviceInfo
              }
            );
            if (!user.iot.devices) {
              user.iot.devices = [iotDevice.id];
            } else {
              user.iot.devices.push(iotDevice.id);
            }
            try {
              await userService.update(user);
            } catch (err) {
              error = {
                name: 'SERVER_ERROR',
                message: 'Error while trying to save the user!',
                type: ErrorType.SERVER_ERROR,
                stack: err && err.message ? err.message : ''
              };
              logger.error(error);
              return res.status(500).send(error);
            }
            logger.info(`POST iot device with result ${JSON.stringify(iotDevice)}`);
            return res.status(200).send({ 'iot-device': iotDevice });
          }
          error = {
            name: 'SERVER_ERROR',
            message: 'Error while trying to create a new IoT Device!',
            type: ErrorType.SERVER_ERROR
          };
          logger.error(error);
          return res.status(500).send(error);
        }
        error = {
          name: 'SERVER_ERROR',
          message: 'User has no credentials for iot devices!',
          type: ErrorType.SERVER_ERROR
        };
        logger.error(error);
        return res.status(500).send(error);
      }
      error = {
        name: 'INVALID_ID',
        message: 'User does not exist!',
        type: ErrorType.INVALID_ID
      };
      logger.error(error);
      return res.status(404).send(error);
    } catch (err) {
      error = {
        name: 'SERVER_ERROR',
        message: 'Error while trying to create a new IoT Device!',
        type: ErrorType.SERVER_ERROR,
        stack: err && err.message ? err.message : ''
      };
      logger.error(error);
      return res.status(500).send(error);
    }
  }
  error = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! Please provide to the JWT Token '
      + 'a body with deviceType, deviceId and events. See ApiDocs for more Information!',
    type: ErrorType.MALFORMED_REQUEST
  };
  logger.error(error);
  return res.status(400).send(error);
}

/**
 * @api {get} /api/v1/iot-devices/ gets all iot devices of a user (admin gets all devices)
 * @apiName getIoTDevices
 * @apiVersion 1.0.0
 * @apiGroup Iot-Devices
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Array } iot-devices the array of iot device objects, if successful
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "iot-devices": [
        {
            "username": "use-auth-token",
            "_id": "5c499dc4c16fe74e7191c5bc",
            "clientId": "d:tcccti:Sensor:Sensor-Test-26",
            "deviceType": "Sensor",
            "deviceId": "Sensor-Test-26",
            "password": "5bq3vj6wb)Sq?JRNqk",
            "events": [
                {
                    "topic": "Event_1",
                    "dataformat": "json"
                },
                {
                    "topic": "Event_2",
                    "dataformat": "json"
                }
            ],
            "__v": 0
        }
    ]
}
   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Error while trying to get all iot devices of user",
      "type": 13,
      "stack": {...}, // optional
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Forbidden
  {
      "name": "FORBIDDEN",
      "message": "User can not get iot devices!",
      "type": 12,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request!Please provide a valid JWT Token on the Authorization Header",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 */
async function getAll(req: Request, res: Response) {
  let error: IError;
  const user = await getUser(req);
  if (user.error) {
    return res.status(400).send(user.error);
  }
  try {
    if (user && user.role && user.role.role) {
      let iotDevices = await iotDeviceService.getAll({});
      if (iotDevices) {
        if (user.role.role !== 'admin' && user.iot && user.iot.devices && user.iot.devices.length) {
          iotDevices = iotDevices.filter((device) => user.iot.devices.contains(device.id));
          if (iotDevices.length) {
            logger.info(`GET ALL iot devices with result ${JSON.stringify(iotDevices)}`);
            return res.status(200).send({ 'iot-devices': iotDevices });
          }
          logger.info(`GET ALL iot devices with empty result`);
          return res.status(204).send();
        }
      }
      logger.info(`GET ALL iot devices with result ${JSON.stringify(iotDevices)}`);
      return res.status(200).send({ 'iot-devices': iotDevices });
    }
    error = {
      name: 'FORBIDDEN',
      message: 'User can not get iot devices!',
      type: ErrorType.FORBIDDEN
    };
    logger.error(error);
    return res.status(403).send(error);
  } catch (err) {
    error = {
      name: 'SERVER_ERROR',
      message: 'Error while trying to get all iot devices of user',
      type: ErrorType.SERVER_ERROR,
      stack: err && err.message ? err.message : ''
    };
    logger.error(error);
    return res.status(400).send(error);
  }
}

/**
 * @api {delete} /api/v1/iot-devices/:id deletes an iot device
 * @apiName deleteIotDevice
 * @apiVersion 1.0.0
 * @apiGroup Iot-Devices
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Object } iot-device is the iot device object, if successful
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "iot-device": {
        "username": "use-auth-token",
        "_id": "5c499dc4c16fe74e7191c5bc",
        "clientId": "d:tcccti:Sensor:Sensor-Test-26",
        "deviceType": "Sensor",
        "deviceId": "Sensor-Test-26",
        "password": "5bq3vj6wb)Sq?JRNqk",
        "events": [
            {
                "topic": "Event_1",
                "dataformat": "json"
            },
            {
                "topic": "Event_2",
                "dataformat": "json"
            }
        ],
        "__v": 0
    }
}
   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Error while trying to delete the iot device with id 9999",
      "type": 13,
      "stack": {...}, // optional
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "name": "INVALID_ID",
      "message": "Could not delete iot device with id 9999",
      "type": 11,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request!Please provide a valid JWT Token on the Authorization Header",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
     * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "  Malformed Request! Please provide additionally to the valid JWT Token a valid iot device id",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 */
async function deleteById(req: Request, res: Response) {
  let error: IError = {
    name: 'SERVER_ERROR',
    message: `Error while trying to delete the iot device with id ${req.params.id}`,
    type: ErrorType.SERVER_ERROR
  };
  const user = await getUser(req);
  if (!user || user.error) {
    return user && user.error ? res.status(400).send(user.error) : res.status(400).send();
  }
  try {
    if (req.params.id && user.iot && user.iot.auth && user.iot.auth.key && user.iot.auth.token) {
      let result = await iotDeviceService.get(req.params.id);
      if (result) {
        const watsonResult = await ibmWatsonService.deleteDevice(
          result.deviceId, result.deviceType, { key: user.iot.auth.key, token: user.iot.auth.token }
        );
        if (watsonResult || watsonResult.success) {
          result = await iotDeviceService.deleteById(req.params.id);
          if (result) {
            const users = await userService.getAll({ 'iot.devices': result.id });
            if (users && users.length) {
              users.forEach((user: any) => {
                user.iot.devices = user.iot.devices.filter((device: any) => device !== result.id);
                userService.update(user);
              });
            }
            logger.info(`DELETE iot device with result ${JSON.stringify(result)}`);
            return res.status(200).send({ 'iot-device': result });
          }
          logger.error(error);
          return res.status(500).send(error);
        }
        logger.error(error);
        return res.status(500).send(error);
      }
      error = {
        name: 'INVALID_ID',
        message: `Could not delete iot device with id ${req.params.id}`,
        type: ErrorType.INVALID_ID
      };
      logger.error(error);
      return res.status(404).send(error);
    }
    error = {
      name: 'MALFORMED_REQUEST',
      message: 'Malformed Request! Please provide additionally to the valid JWT Token a valid iot device id',
      type: ErrorType.MALFORMED_REQUEST
    };
    logger.error(error);
    return res.status(400).send(error);
  } catch (err) {
    error.stack = err && err.message ? err.message : '';
    logger.error(error);
    return res.status(500).send(error);
  }
}

/**
 * @api {post} /api/v1/iot-devices/search Searches an iot device by a given query
 * @apiName searchIoTDevice
 * @apiVersion 1.0.0
 * @apiGroup IoT-Devices
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {Object} query is the query object for mongoose
 * @apiParam {String} limit is the limit of results (optional)
 * @apiParam {String} skip is the number of elements to skip (optional)
 *
 * @apiParamExample {json} Request-Example:
{
  "query": {
    "$and": [
      {
        "$text": {
          "$search": "Sensor"
        }
      }
    ]
  }
}
 * @apiSuccess { Array } iot-devices the array of iot device objects, if successful
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
{
    "iot-devices": [
        {
            "username": "use-auth-token",
            "_id": "5c49af9825a8926218d3a808",
            "clientId": "d:tcccti:Sensor:Sensor-Test-27",
            "deviceType": "Sensor",
            "deviceId": "Sensor-Test-27",
            "password": "URr8E9qPui*EqJWQW(",
            "events": [
                {
                    "topic": "Event_1",
                    "dataformat": "json"
                },
                {
                    "topic": "Event_2",
                    "dataformat": "json"
                }
            ],
            "__v": 0
        }
    ]
}

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
    "name": "SERVER_ERROR",
    "message": "Error while trying to get the iot devices!",
    "type": 13,
    "stack": {...}, // optional
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 * {
    "name": "SERVER_ERROR",
    "message": "User has no credentials for iot devices!",
    "type": 13,
    "level": "error",
    "timestamp": "2019-01-22T09:22:05.900Z"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request!Please provide a valid JWT Token on the Authorization Header",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 */
async function search(req: Request, res: Response) {
  req.body.query = validatorService.checkQuery(req.body.query, searchableTextFields);
  const user = await getUser(req);
  if (!user || user.error) {
    return user && user.error ? res.status(400).send(user.error) : res.status(400).send();
  }
  try {
    let iotDevices: Array<any> = [];
    if (user.role.role && user.role.role === 'admin') {
      iotDevices = await iotDeviceService.getAll(req.body.query, req.body.limit, req.body.skip);
    } else if (user.iot && user.iot.devices && user.role && user.role.role && user.role.role !== 'admin') {
      const tmpList = await iotDeviceService.getAll(req.body.query, req.body.limit, req.body.skip);
      iotDevices = [];
      user.iot.devices.forEach((deviceId: any) => {
        tmpList.forEach((device: any) => {
          if (device.id === deviceId) {
            iotDevices.push(device);
          }
        });
      });
    } else {
      iotDevices = [];
    }
    if (iotDevices.length === 0) {
      logger.info(`POST search for iot devices with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      return res.status(204).send({ 'iot-devices': iotDevices });
    } if (req.body.limit && req.body.skip) {
      logger.info(`POST search for iot devices with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds partial results ${JSON.stringify(iotDevices)}`);
      return res.status(206).send({ 'iot-devices': iotDevices });
    }
    logger.info(`POST search for orders with query ${JSON.stringify(req.body.query)}, `
      + `limit ${req.body.limit} skip ${req.body.skip} `
      + `holds results ${JSON.stringify(iotDevices)}`);
    return res.status(200).send({ 'iot-devices': iotDevices });
  } catch (err) {
    const error: IError = {
      name: 'SERVER_ERROR',
      message: 'Error while trying to get the iot devices!',
      type: ErrorType.SERVER_ERROR,
      stack: err && err.message ? err.message : ''
    };
    logger.error(error);
    return res.status(500).send(error);
  }
}
/**
 * @api {get} /api/v1/iot-devices/types gets all types of iot devices
 * @apiName getIoTDeviceTypes
 * @apiVersion 1.0.0
 * @apiGroup Iot-Devices
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Object } deviceTypes is an array of device type objects
 * {
 *   "id": "string",
 *   "classId": "string",
 *   "createdDateTime": "2019-01-15T09:00:05.668Z",
 *   "updatedDateTime": "2019-01-15T09:00:05.668Z"
 * },
 * if successful
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "deviceTypes": [
        {
            "id": "Sensor",
            "classId": "Device",
            "createdDateTime": "2019-01-15T09:00:05.668Z",
            "updatedDateTime": "2019-01-15T09:00:05.668Z"
        }
    ]
}
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No Content

   * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Error while trying to get the device types!",
      "type": 13,
      "stack": {...}, // optional
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request! JWT Token does not match a user or the user has no iot credentials",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request!Please provide a valid JWT Token on the Authorization Header",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 */
async function getDeviceTypes(req: Request, res: Response) {
  let error: IError;
  const user = await getUser(req);
  if (user.error) {
    return res.status(400).send(user.error);
  }
  try {
    if (user && user.iot && user.iot.auth && user.iot.auth.token && user.iot.auth.key) {
      const result = await ibmWatsonService.getDeviceTypes({
        key: config.ibmWatson.key, token: config.ibmWatson.token
      });
      if (result && result.results) {
        if (!result.results.length) {
          logger.info('GET DEVICE TYPES No results of Device Types');
          return res.status(204).send();
        }
        const deviceTypes = [];
        result.results.forEach((deviceType: any) => {
          const newObj = {
            id: deviceType.id,
            classId: deviceType.classId,
            createdDateTime: deviceType.createdDateTime,
            updatedDateTime: deviceType.updatedDateTime
          };
          deviceTypes.push(newObj);
        });
        logger.info(`GET DEVICE TYPES Result of Device Types: ${JSON.stringify(deviceTypes)}`);
        return res.status(200).send({ deviceTypes });
      }
      error = {
        name: 'SERVER_ERROR',
        message: 'Error while trying to get the device types!',
        type: ErrorType.SERVER_ERROR
      };
      logger.error(error);
      return res.status(500).send(error);
    }
    error = {
      name: 'MALFORMED_REQUEST',
      message: 'Malformed Request! JWT Token does not match a user or the user has no iot credentials!',
      type: ErrorType.MALFORMED_REQUEST
    };
    logger.error(error);
    return res.status(400).send(error);
  } catch (err) {
    error = {
      name: 'SERVER_ERROR',
      message: 'Error while trying to get the device types!',
      type: ErrorType.SERVER_ERROR,
      stack: err && err.message ? err.message : ''
    };
    logger.error(error);
    return res.status(500).send(error);
  }
}

async function getUser(req: Request) {
  const error: IError = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! Please provide a valid JWT Token on the Authorization Header',
    type: ErrorType.MALFORMED_REQUEST
  };
  if (req.headers && req.headers.authorization
    && typeof req.headers.authorization === 'string') {
    try {
      const token = req.headers.authorization.split('JWT')[1].trim();
      const user = await userService.getUserByToken(token);
      if (user) {
        return user;
      }
      return { error };
    } catch (err) {
      logger.error(error);
      return { error };
    }
  }
  logger.error(error);
  return { error };
}

export default {
  get, create, getAll, deleteById, getDeviceTypes, search
};
