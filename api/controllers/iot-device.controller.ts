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

async function get (req: Request, res: Response) {
  if (req.params.id && req.headers && req.headers.authorization
        && typeof req.headers.authorization === 'string') {
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
          const iotDevice = {
            clientId: result.clientId,
            deviceType: result.typeId,
            deviceId: result.deviceId,
            deviceInfo: result.deviceInfo
          };
          return res.status(200).send({ 'iot-device': iotDevice });
        }
        return res.status(204).send();
      }
      return 'Hallo';
    }
    const error: IError = {
      name: 'MALFORMED_REQUEST',
      message: 'Malformed Request! The request needs to have at least a start or end date!',
      type: ErrorType.MALFORMED_REQUEST
    };
    logger.error(error);
    return res.status(400).send(error);
  }
  return 'Hallo';
}

async function create (req: Request, res: Response) {
  if (req.headers && req.headers.authorization
        && typeof req.headers.authorization === 'string'
        && req.body.deviceType && req.body.deviceId && req.body.events && req.body.events.length) {
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
              type: ErrorType.SERVER_ERROR
            };
            logger.error(error);
            return res.status(500).send(error);
          }
        }
      }

      if (user.iot.auth.key && user.iot.auth.token) {
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
            const error: IError = {
              name: 'SERVER_ERROR',
              message: 'Error while trying to save the user!',
              type: ErrorType.SERVER_ERROR
            };
            logger.error(error);
            return res.status(500).send(error);
          }
          delete iotDevice.__v;
          return res.status(200).send({ 'iot-device': iotDevice });
        }
        return 'Hallo';
      }
      return 'Hallo';
    }
    return 'Hallo';
  }
  return 'Hallo';
}

async function getAll (req: Request, res: Response) {
  return res.status(200).send(req);
}

async function deleteById (req: Request, res: Response) {
  return res.status(200).send(req);
}

export default {
  get, create, getAll, deleteById
};
