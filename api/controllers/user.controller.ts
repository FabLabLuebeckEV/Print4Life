/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { ErrorType, IError } from '../services/router.service';
import logger from '../logger';
import validatorService from '../services/validator.service';
import FablabService from '../services/fablab.service';
import UserService from '../services/user.service';
import { searchableTextFields } from '../models/user.model';
import IoTDeviceService from '../services/iot-device.service';
import IBMWatsonService from '../services/ibm.watson.service';

/* eslint-enable no-unused-vars */

const userService = new UserService();
const iotDeviceService = new IoTDeviceService();
const ibmWatsonService = new IBMWatsonService();

/**
 * @api {post} /api/v1/users/ Adds a new user
 * @apiName createUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Object } user the new user object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
  {
    "user": {
        "_id": "5b7d29ed40ddae62a94e5940",
        "firstname": "Hans",
        "lastname": "Der Tester",
        "username": "Hansiii",
        "password": "$2b$10$WDCFfQTo1KKLt3ZXtlkvuuso1Pxqu6FbkG6KvJWzchz2k0xeDNVYe",
        "email": "hansiii@alm.de",
        "address": {
            "street": "Middlehofer Straße 42",
            "zipCode": "421337",
            "city": "Geldhausen",
            "country": "Luxemburg"
        },
        "role": {
            "role": "admin"
        },
        "__v": 0
    }
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed user, one or more parameters wrong or missing",
      "stack": {
          ...
      }
  }
 */
async function create (req, res) {
  let user;
  let reject = false;
  try {
    user = await userService.getUserByUsername(req.body.username);
    if (user) {
      const msg = {
        type: ErrorType.USERNAME_EXISTS,
        error: 'Malformed user. Username already exists!',
        stack: undefined
      };
      logger.error(msg);
      reject = true;
      res.status(400).send(msg);
    }
  } catch (error) {
    const msg = {
      error: `Error while getting the user by its username (${req.body.username})`,
      stack: error
    };
    logger.error(msg);
  }

  if (!reject) {
    try {
      user = await userService.search({ email: req.body.email });
      if (user && user.length > 0) {
        const msg = {
          type: ErrorType.EMAIL_EXISTS,
          error: 'Malformed user. Email Address already exists!',
          stack: undefined
        };
        logger.error(msg);
        reject = true;
        res.status(400).send(msg);
      }
    } catch (error) {
      const msg = { error: `Error while getting the user by its email address (${req.body.email})`, stack: error };
      logger.error(msg);
    }
  }

  if (!reject) {
    userService.create(req.body).then((user) => {
      userService.selfActivateUser(user, true);
      res.status(200).send({ user });
    }).catch((err) => {
      const msg = { error: 'Malformed user, one or more parameters wrong or missing', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
}

/**
 * @api {put} /api/v1/users/ Updates a user
 * @apiName updateUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Object } user the new user object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
  {
    "user": {
        "_id": "5b7d29ed40ddae62a94e5940",
        "firstname": "Hans",
        "lastname": "Der Tester",
        "username": "Hansiii",
        "password": "$2b$10$WDCFfQTo1KKLt3ZXtlkvuuso1Pxqu6FbkG6KvJWzchz2k0xeDNVYe",
        "email": "hansiii@alm.de",
        "address": {
            "street": "Middlehofer Straße 42",
            "zipCode": "421337",
            "city": "Geldhausen",
            "country": "Luxemburg"
        },
        "role": {
            "role": "admin"
        },
        "__v": 0
    }
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed user, one or more parameters wrong or missing",
      "stack": {
          ...
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
 */
async function update (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const user = await userService.update(req.body);
    logger.info(`PUT User with result ${JSON.stringify(user)}`);
    return res.status(200).send({ user });
  } catch (err) {
    logger.error({ error: 'Malformed update.', stack: err });
    return res.status(400).send({ error: 'Malformed update.', stack: err });
  }
}

/**
 * @api {delete} /api/v1/users/ Deactivates the user
 * @apiName deleteUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Object } user the deactivated user object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
  {
    "user": {
        "_id": "5b7d29ed40ddae62a94e5940",
        "firstname": "Hans",
        "lastname": "Der Tester",
        "username": "Hansiii",
        "password": "$2b$10$WDCFfQTo1KKLt3ZXtlkvuuso1Pxqu6FbkG6KvJWzchz2k0xeDNVYe",
        "email": "hansiii@alm.de",
        "address": {
            "street": "Middlehofer Straße 42",
            "zipCode": "421337",
            "city": "Geldhausen",
            "country": "Luxemburg"
        },
        "role": {
            "role": "admin"
        },
        "activated": true,
        "__v": 0
    }
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "name": "SERVER_ERROR",
      "message": "Error while trying to delete the user!",
      "type": 13,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "name": "MALFORMED_REQUEST",
      "message": "Malformed Request! Please provide a user id!",
      "type": 14,
      "level": "error",
      "timestamp": "2019-01-22T09:16:56.793Z"
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
 */
async function deleteById (req: Request, res: Response) {
  const error: IError = {
    name: 'SERVER_ERROR',
    message: 'Error while trying to delete the user!',
    type: ErrorType.SERVER_ERROR
  };
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const user = await userService.deleteById(req.params.id);
    if (user) {
      if (user.iot) {
        if (user.iot.auth && user.iot.auth.key) {
          await ibmWatsonService.deleteAPIKey(user.iot.auth.key);
        }
      }
      if (user.iot.devices) {
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < user.iot.devices.length; i = 1 + i) {
          const deviceId = user.iot.devices[i];
          await iotDeviceService.deleteById(deviceId);
        }
        /* eslint-enable no-await-in-loop */
      }
      delete user.iot;
      await userService.update(user);
      logger.info(`DELETE User with result ${JSON.stringify(user)}`);
      return res.status(200).send({ user });
    }
    logger.error(error);
    return res.status(500).send(error);
  } catch (err) {
    error.stack = err && err.message ? err : '';
    logger.error(error);
    return res.status(500).send(error);
  }
}

/**
 * @api {post} /api/v1/users/search Request the list of users by a given query
 * @apiName GetUsers
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} users an array of user objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "users": [
        {
            "activated": true,
            "_id": "5bc044eee8aa0b489b47f681",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansi",
            "password": "$2b$10$PekSZs6AI.TWsxMxWEU6tOW6De085SwmCQY/WnYQ7IZ9AXwpt7auC",
            "email": "hansi@alm.de",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "admin"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T06:53:34.419Z",
            "__v": 0
        },
        {
            "activated": true,
            "_id": "5bc046d9e465834bf61a8225",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansihzrdt4i94r59xl92bf9gzf",
            "password": "$2b$10$dwZ2WVLga6yZeZpJEZ9F9ep6h4AudXFLUFh.2BURNyzA4JhdqN6AK",
            "email": "hansi@alm.de5yuyw0wc52a188o714v0ar",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "user"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T07:01:45.252Z",
            "__v": 0
        },
        {
            "activated": true,
            "_id": "5bc046d9e465834bf61a8226",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansihzrdt4i94r59xl92bf9gzflf0g90lrvq6iggfnrlekg",
            "password": "$2b$10$pSFR.JP2aAa4AfazJCQb1.wrhIZyFJFV5rJ4OzaK9KO0edJV4WsYC",
            "email": "hansi@alm.de5yuyw0wc52a188o714v0arfr6l3mkxmbjlv5y5jogxqa",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "user"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T07:01:45.397Z",
            "__v": 0
        },
        {
            "activated": true,
            "_id": "5bc046d9e465834bf61a8227",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansihzrdt4i94r59xl92bf9gzflf0g90lrvq6iggfnrlekg639jpe08wu8wlb7qd5yrhs",
            "password": "$2b$10$yg4rGyLVTG4s9m3MMRjUIeDZaM9Vg9UuDBw8S36Has5Nxdw2.mqIW",
            "email": "hansi@alm.de5yuyw0wc52a188o714v0arfr6l3mkxmbjlv5y5jogxqavfoqjm5t67ot4xcmi464kn",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "user"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T07:01:45.469Z",
            "__v": 0
        },
        {
            "activated": true,
            "_id": "5bc04796ee614c4d7c67e92c",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansikl6nyrnfvj7tdr9f1lf6y",
            "password": "$2b$10$VE7oAe33yVXuuWG3I5Et8eSqm1AG3ZWLVJpc5zoiBHEJYLKjL4YtW",
            "email": "hansi@alm.demujjbxjnxe7wvcn17ji96",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "user"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T07:04:54.388Z",
            "__v": 0
        },
        {
            "activated": true,
            "_id": "5bc04796ee614c4d7c67e92d",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansikl6nyrnfvj7tdr9f1lf6ykkjy0d1o4au8e2mugnsxi",
            "password": "$2b$10$JiALe2OrknzlW2eYvx.X.ejSgqPJ7XVYKhyjnWNHqsrvvPIsYLg/S",
            "email": "hansi@alm.demujjbxjnxe7wvcn17ji96sjmtmnn8capkyuegf24qhs",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "user"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T07:04:54.538Z",
            "__v": 0
        },
        {
            "activated": true,
            "_id": "5bc04796ee614c4d7c67e92e",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansikl6nyrnfvj7tdr9f1lf6ykkjy0d1o4au8e2mugnsxi282v7nkgd8dhlgbaqn7krcc",
            "password": "$2b$10$kn0piX6JbA/SurtEfthZFezDC1oXafLJ3Vo8r2iRhr6l7hmGzcLRO",
            "email": "hansi@alm.demujjbxjnxe7wvcn17ji96sjmtmnn8capkyuegf24qhsmaalcup1tqtmjp1l0c9w",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "user"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T07:04:54.689Z",
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
      "error": "Error while trying to get all users!",
      "stack": {
          ...
      }
  }
* @apiSuccessExample Success-Response:
*    HTTP/1.1 206 Partial Content
*    {
      "users": [
        {
            "activated": true,
            "_id": "5bc044eee8aa0b489b47f681",
            "firstname": "Hans",
            "lastname": "Der Tester",
            "username": "Hansi",
            "password": "$2b$10$PekSZs6AI.TWsxMxWEU6tOW6De085SwmCQY/WnYQ7IZ9AXwpt7auC",
            "email": "hansi@alm.de",
            "address": {
                "street": "Middlehofer Straße 42",
                "zipCode": "421337",
                "city": "Geldhausen",
                "country": "Luxemburg"
            },
            "role": {
                "role": "admin"
            },
            "preferredLanguage": {
              "language": "en"
            },
            "createdAt": "2018-10-12T06:53:34.419Z",
            "__v": 0
        }
      ]
    }
*/
function search (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query, searchableTextFields);
  userService.search(req.body.query, req.body.limit, req.body.skip).then((users) => {
    if (users.length === 0) {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send();
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds partial results ${JSON.stringify(users)}`);
      res.status(206).send({ users });
    } else {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds results ${JSON.stringify(users)}`);
      res.status(200).send({ users });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific user with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific user with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
  });
}

/**
 * @api {post} /api/v1/users/count counts the users
 * @apiName count
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Number } count the number amount of user, if success
 * @apiParam query is the query object for mongoose
 * @apiParamExample {json} Request-Example:
 *
{
  "$or":
    [
      {
        "role": "admin"
      },
      {
        "role": "user"
      }
    ]
}
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "count": 8
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while counting users!",
      "stack": {
          ...
      }
  }
 */
function count (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query, searchableTextFields);
  userService.count(req.body.query).then((count) => {
    logger.info(`POST count with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error({ error: 'Error while counting users!', err });
    res.status(500).send({ error: 'Error while counting users!', err });
  });
}

/**
 * @api {get} /api/v1/users/roles Gets all roles
 * @apiName getRoles
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Array } roles a list of valid roles
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *  {
      "roles": [
          "guest",
          "user",
          "editor",
          "admin"
      ]
    }
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get all valid roles!",
      "stack": {
          ...
      }
  }
 */
function getRoles (req, res) {
  userService.getRoles().then((roles) => {
    if (!roles) {
      res.status(204).send();
    } else {
      res.status(200).send({ roles });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all valid roles!', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {get} /api/v1/users/languages Gets all supported languages
 * @apiName getLanguages
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Array } languages a list of supported languages
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *  {
      "languages": [
          "german",
          "danish",
          "english",
      ]
    }
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get all valid languages!",
      "stack": {
          ...
      }
  }
 */
function getLanguages (req, res) {
  userService.getLanguages().then((languages) => {
    if (!languages) {
      res.status(204).send();
    } else {
      res.status(200).send({ languages });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all valid languages!', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

/**
 * @api {post} /api/v1/users/login Logs a user in and returns a jsonwebtoken
 * @apiName login
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Object } login a login object with success and token
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
  "login": {
      "success": true,
      "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6....."
  }
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Server Error
{
    "error": "Authentication failed. Wrong password.",
    "stack": {
        "success": false,
        "msg": "Authentication failed. Wrong password."
    }
}
 */
async function login (req, res) {
  let user;
  try {
    user = await userService.getUserByUsername(req.body.username);
  } catch (err) {
    const msg = { error: 'User not found.', stack: err };
    logger.error(msg);
    res.status(404).send(msg);
  }

  logger.info(`User "${user.username}" was found in DB and tried to login with a bad password.`);

  let login;
  try {
    login = await userService.login(user, req.body.password);
  } catch (err) {
    const msg = {
      type: err.type, error: err.msg, stack: err, data: undefined, login: { success: false }
    };
    logger.error(msg);
    if (err.type === ErrorType.USER_DEACTIVATED) {
      msg.data = err.data;
      res.status(403).send(msg);
    } else {
      res.status(401).send(msg);
    }
  }

  if (login && login.success) {
    logger.info(`${user.username} successfully logged in with token ${login.token}`);
    res.status(200).send({ login });
  }
}

/**
 * @api {get} /api/v1/users/findown gets the logged in user
 * @apiName findOwnUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Object } user the user object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "user": {
        "_id": "5bb21bb7cf8826848381a4f6",
        "firstname": "Hans",
        "lastname": "Der Tester",
        "username": "Hansi",
        "password": "$2b$10$YUn2.qB4H.fvBwUH/aQYO.HCGWek.XIlSS/.SSddYzyvGtTy9tMsO",
        "email": "hansi@alm.de",
        "address": {
            "street": "Middlehofer Straße 42",
            "zipCode": "421337",
            "city": "Geldhausen",
            "country": "Luxemburg"
        },
        "createdAt": "2018-10-01T13:05:59.429Z",
        "role": {
            "role": "admin"
        },
        "__v": 0
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "'GET User by token with no result.'",
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
      }
  }
 * @apiPermission loggedIn
 */
function findown (req, res) {
  if (req.headers && req.headers.authorization && typeof req.headers.authorization === 'string') {
    const token = req.headers.authorization.split('JWT')[1].trim();
    userService.getUserByToken(token).then((user) => {
      if (user) {
        logger.info(`GET User by token with result ${user}`);
        res.status(200).send({ user });
      } else {
        const msg = { error: 'GET User by token with no result.' };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: 'Error while retrieving the user.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  } else {
    const msg = { error: 'No Authorization Header with JWT Token given.' };
    logger.error(msg);
    res.status(400).send(msg);
  }
}

/**
 * @api {get} /api/v1/users/:id gets a user by its id
 * @apiName getUserById
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Object } user the user object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "user": {
        "_id": "5bb21bb7cf8826848381a4f6",
        "firstname": "Hans",
        "lastname": "Der Tester",
        "username": "Hansi",
        "password": "$2b$10$YUn2.qB4H.fvBwUH/aQYO.HCGWek.XIlSS/.SSddYzyvGtTy9tMsO",
        "email": "hansi@alm.de",
        "address": {
            "street": "Middlehofer Straße 42",
            "zipCode": "421337",
            "city": "Geldhausen",
            "country": "Luxemburg"
        },
        "createdAt": "2018-10-01T13:05:59.429Z",
        "role": {
            "role": "admin"
        },
        "__v": 0
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "'GET User by id with no result.'",
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

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
      }
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
    const user = await userService.get(req.params.id);
    if (user) {
      logger.info(`GET User by id with result ${user}`);


      // remove user address, see #161
      let authorized = false;
      if (req.headers.authorization) {
        const token = req.headers.authorization.split('JWT')[1].trim();
        const ownUser = await userService.getUserByToken(token);

        authorized = ownUser && (ownUser.role.role === 'admin' || ownUser.role.role === 'editor');
      }

      if (!authorized) {
        delete user.address;
        user.address = undefined;
      }

      return res.status(200).send({ user });
    }
    const msg = { error: 'GET User by id with no result.' };
    logger.error(msg);
    return res.status(404).send(msg);
  } catch (err) {
    const msg = { error: 'Error while retrieving the user.', stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

/**
 * @api {get} /api/v1/users/:id/getNames gets the names of a user by its id
 * @apiName getNamesOfUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Object } user the user object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "user": {
        "_id": "5bc98e4ea1283b2033f544c8",
        "firstname": "Hans",
        "lastname": "Der Tester"
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "'GET User by id with no result.'",
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

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
      }
  }
 * @apiPermission none
 */
async function getNames (req, res) {
  const fablabService = new FablabService();
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const user = await userService.get(req.params.id);
    if (user) {
      user.fablabName = '';
      if (user.fablabId) {
        const fablab = await fablabService.get(user.fablabId);
        user.fablabName = fablab.name;
      }
      logger.info(`GET User by id with result ${user}`);
      return res.status(200).send({
        user: {
          _id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          fullname: `${user.firstname} ${user.lastname}`,
          fablabName: user.fablabName
        }
      });
    }
    const msg = { error: 'GET User by id with no result.' };
    logger.error(msg);
    return res.status(404).send(msg);
  } catch (err) {
    const msg = { error: 'Error while retrieving the user.', stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

/**
 * @api {put} /api/v1/users/:id/activationRequest ask admin to activate a user
 * @apiName activationRequestByUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { String } msg an response object
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "msg": "Admins informed"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "'GET User by id with no result.'",
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
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
 * @apiPermission none
 */
async function sendActivationRequest (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const user = await userService.get(req.params.id);
    if (user) {
      userService.selfActivateUser(user, false);
      return res.status(200).send({ msg: 'Confirmation email sent' });
    }
    const msg = { error: 'GET User by id with no result.' };
    logger.error(msg);
    return res.status(404).send(msg);
  } catch (err) {
    const msg = { error: 'Error while retrieving the user.', stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

/**
 * @api {put} /api/v1/users/:id/activate activates a user
 * @apiName activateUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { String } msg an response object
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "msg": "Account activated"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "'GET User by id with no result.'",
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
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
 * @apiPermission none
 */
async function activateUser (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const user = await userService.get(req.params.id);
    if (user) {
      user.activated = true;
      user.save();
      return res.status(200).send({ msg: 'Account activated' });
    }
    const msg = { error: 'GET User by id with no result.' };
    logger.error(msg);
    return res.status(404).send(msg);
  } catch (err) {
    const msg = { error: 'Error while activating the user.', stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

/**
 * @api {post} /api/v1/users/resetPassword/ resets the password of a user
 * @apiName resetPassword
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { String } msg an response object
 *
 * @apiParamExample {json} Request-Example:
 *
{
  "email": "hans-hansen@hans.com"
}
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "msg": "Password reset"
}

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while resetting the password.",
      "stack": {
          ...
      }
  }
 * @apiPermission none
 */
function resetPassword (req, res) {
  if (!req.body.email) {
    res.status(400).send({ error: 'Malformed Request! No Email given.' });
  } else {
    userService.resetPassword(req.body.email).then((success) => {
      if (!success) {
        const msg = {
          error: `Error while resetting the password or there is no user with e-mail address ${req.body.email}`
        };
        logger.error(msg);
      } else {
        logger.info({ msg: `Password reset for user with e-mail address ${req.body.email}` });
      }
      res.status(200).send({ msg: 'Password reset' });
    }).catch((err) => {
      const msg = { error: 'Error while resetting the password.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
}

/**
 * @api {put} /api/v1/users/changePassword/ changes the password of a user
 * @apiName changePassword
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { String } msg a response message
 *
 * @apiParamExample {json} Request-Example:
 *
{
  "oldPassword": "123456",
  "newPassword": "vieSahTuthui5ki9Aefu"
}
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "msg": "User <user._id> successfully changed his password."
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Server Error
  {
      "error": "The current user password is not correct.'",
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Something bad happened",
      "stack": {
          ...
      }
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Server Error
  {
      "error": "GET User by id with no result.",
      "stack": {
          ...
      }
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
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
 * @apiPermission loggedIn
 */
async function changePassword (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const user = await userService.get(req.params.id);
    if (user) {
      return user.comparePassword(req.body.oldPassword, (err, isMatch) => {
        if (err) {
          const msg = { error: 'The current user password is not correct.' };
          logger.error(msg);
          return res.status(401).send(msg);
        }
        if (isMatch) {
          const msg = { msg: `User ${user._id} successfully changed his password.` };
          logger.error(msg);
          userService.changePassword(user, req.body.newPassword);
          return res.status(200).send(msg);
        }
        const msg = { error: 'Something bad happened' };
        logger.error(msg);
        return res.status(500).send(msg);
      });
    }
    const msg = { error: 'GET User by id with no result.' };
    logger.error(msg);
    return res.status(404).send(msg);
  } catch (err) {
    const msg = { error: 'Error while retrieving the user.', stack: err };
    logger.error(msg);
    return res.status(500).send(msg);
  }
}

export default {
  create,
  getRoles,
  getLanguages,
  login,
  sendActivationRequest,
  getNames,
  get,
  findown,
  search,
  count,
  update,
  deleteById,
  resetPassword,
  changePassword,
  activateUser
};
