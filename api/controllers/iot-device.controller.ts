/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { IError, ErrorType } from '../services/router.service';
import { IoTDeviceService } from '../services/iot-device.service';
import logger from '../logger';
import UserService from '../services/user.service';
import IBMWatsonService from '../services/ibm.watson.service';
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
async function get (req: Request, res: Response) {
  let error: IError;
  if (req.params.id && req.headers && req.headers.authorization
    && typeof req.headers.authorization === 'string') {
    try {
      const token = req.headers.authorization.split('JWT')[1].trim();
      const user = await userService.getUserByToken(token);
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
            return res.status(200).send({ 'iot-device': retIoTDevice });
          }
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
        stack: err.message
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
async function create (req: Request, res: Response) {
  let error: IError;
  if (req.headers && req.headers.authorization
    && typeof req.headers.authorization === 'string'
    && req.body.deviceType && req.body.deviceId && req.body.events && req.body.events.length) {
    try {
      const token = req.headers.authorization.split('JWT')[1].trim();
      const user = await userService.getUserByToken(token);
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
                stack: err.message
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
          const result = await ibmWatsonService.createDevice(
            req.body.deviceType, req.body.deviceId, req.body.deviceInfo, {
              key: user.iot.auth.key, token: user.iot.auth.token
            }
          );
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
                stack: err.message
              };
              logger.error(error);
              return res.status(500).send(error);
            }
            delete iotDevice.__v;
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
        stack: err.message
      };
      logger.error(error);
      return res.status(500).send(error);
    }
  }
  error = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! Please provide a valid JWT Token on the Authorization Header,'
      + 'and a body with deviceType, deviceId and events. See ApiDocs for more Information!',
    type: ErrorType.MALFORMED_REQUEST
  };
  logger.error(error);
  return res.status(400).send(error);
}

async function getAll (req: Request, res: Response) {
  return res.status(200).send(req);
}

async function deleteById (req: Request, res: Response) {
  return res.status(200).send(req);
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
async function getDeviceTypes (req: Request, res: Response) {
  let error: IError;
  if (req.headers && req.headers.authorization
    && typeof req.headers.authorization === 'string') {
    try {
      const token = req.headers.authorization.split('JWT')[1].trim();
      const user = await userService.getUserByToken(token);
      if (user && user.iot && user.iot.auth && user.iot.auth.token && user.iot.auth.key) {
        const result = await ibmWatsonService.getDeviceTypes({
          key: user.iot.auth.key, token: user.iot.auth.token
        });
        if (result && result.results) {
          if (!result.results.length) {
            logger.info('No results of Device Types');
            return res.status(204).send();
          }
          const deviceTypes = [];
          let logString = '';
          result.results.forEach((deviceType: any) => {
            const newObj = {
              id: deviceType.id,
              classId: deviceType.classId,
              createdDateTime: deviceType.createdDateTime,
              updatedDateTime: deviceType.updatedDateTime
            };
            deviceTypes.push(newObj);
            logString += `${JSON.stringify(newObj)}, `;
          });
          logger.info(`Result of Device Types: ${logString}`);
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
        stack: err.message
      };
      logger.error(error);
      return res.status(500).send(error);
    }
  }
  error = {
    name: 'MALFORMED_REQUEST',
    message: 'Malformed Request! Please provide a valid JWT Token on the Authorization Header',
    type: ErrorType.MALFORMED_REQUEST
  };
  logger.error(error);
  return res.status(400).send(error);
}

export default {
  get, create, getAll, deleteById, getDeviceTypes
};
