import * as express from 'express';
import userCtrl from '../controllers/user.controller';
import logger from '../logger';
import routerService, { ErrorType } from '../services/router.service';
import validatorService from '../services/validator.service';


const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

/**
 * @api {post} /api/v1/users/ Adds a new user
 * @apiName createUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { user } the new user object, if success
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
router.post('/', async (req, res) => {
  let user;
  let reject = false;
  try {
    user = await userCtrl.getUserByUsername(req.body.username);
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

  try {
    user = await userCtrl.getUsers({ email: req.body.email });
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
  if (!reject) {
    userCtrl.signUp(req.body).then((user) => {
      userCtrl.informAdmins(user, true);
      res.status(200).send({ user });
    }).catch((err) => {
      const msg = { error: 'Malformed user, one or more parameters wrong or missing', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
});

/**
 * @api {get} /api/v1/users/search Request the list of users by a given query
 * @apiName GetUsers
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} orders an array of order objects
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
router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    userCtrl.updateUser(req.body).then((user) => {
      logger.info(`PUT User with result ${JSON.stringify(user)}`);
      res.status(200).send({ user });
    }).catch((err) => {
      logger.error({ error: 'Malformed update.', stack: err });
      res.status(400).send({ error: 'Malformed update.', stack: err });
    });
  }
});

router.route('/:id').delete((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    userCtrl.deleteUser(req.params.id).then((user) => {
      logger.info(`DELETE User with result ${JSON.stringify(user)}`);
      res.status(200).send({ user });
    }).catch((err) => {
      logger.error({ error: 'Malformed Request!', stack: err });
      res.status(400).send({ error: 'Malformed Request!', stack: err });
    });
  }
});

router.route('/search').post((req, res) => {
  userCtrl.getUsers(req.body.query, req.body.limit, req.body.skip).then((users) => {
    if (users.length === 0) {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ users });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} ` +
        `holds partial results ${JSON.stringify(users)}`);
      res.status(206).send({ users });
    } else {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} ` +
        `holds results ${JSON.stringify(users)}`);
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
});

/**
 * @api {post} /api/v1/users/count counts the users
 * @apiName count
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { count } the number amount of user, if success
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
router.route('/count').post((req, res) => {
  userCtrl.count(req.body.query).then((count) => {
    logger.info(`POST count with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error({ error: 'Error while counting users!', err });
    res.status(500).send({ error: 'Error while counting users!', err });
  });
});

/**
 * @api {get} /api/v1/users/roles Gets all roles
 * @apiName getRoles
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { roles } a list of valid roles
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
router.route('/roles').get((req, res) => {
  userCtrl.getRoles().then((roles) => {
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
});

/**
 * @api {get} /api/v1/users/languages Gets all supported languages
 * @apiName getLanguages
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { languages } a list of supported languages
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *  {
      "roles": [
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
router.route('/languages').get((req, res) => {
  userCtrl.getLanguages().then((languages) => {
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
});

/**
 * @api {post} /api/v1/users/login Logs a user in and returns a jsonwebtoken
 * @apiName login
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { login } a login object with success and token
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
router.route('/login').post(async (req, res) => {
  let user;
  try {
    user = await userCtrl.getUserByUsername(req.body.username);
  } catch (err) {
    const msg = { error: 'User not found.', stack: err };
    logger.error(msg);
    res.status(404).send(msg);
  }

  logger.info(`User "${user.username}" was found in DB and tried to login with a bad password.`);

  let login;
  try {
    login = await userCtrl.login(user, req.body.password);
  } catch (err) {
    const msg = { type: err.type, error: err.msg, stack: err, data: undefined, login: { success: false } };
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
});

/**
 * @api {get} /api/v1/users/findown gets the logged in user
 * @apiName findOwnUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { user } the user object, if success
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
 */
router.route('/findown').get((req, res) => {
  if (req.headers && req.headers.authorization && typeof req.headers.authorization === 'string') {
    const token = req.headers.authorization.split('JWT')[1].trim();
    userCtrl.getUserByToken(token).then((user) => {
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
});

/**
 * @api {get} /api/v1/users/:id gets a user by its id
 * @apiName getUserById
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { user } the user object, if success
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

 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
    "error": "Id needs to be a 24 character long hex string!"
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
      }
  }
 */
router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    userCtrl.getUserById(req.params.id).then((user) => {
      if (user) {
        logger.info(`GET User by id with result ${user}`);
        res.status(200).send({ user });
      } else {
        const msg = { error: 'GET User by id with no result.' };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: 'Error while retrieving the user.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

/**
 * @api {put} /api/v1/users/:id/activationRequest activate a user
 * @apiName activationRequestByUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { object } an response object
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
 */
router.route('/:id/activationRequest/').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    userCtrl.getUserById(req.params.id).then((user) => {
      if (user) {
        userCtrl.informAdmins(user, false);
        res.status(200).send({ msg: 'Admins informed' });
      } else {
        const msg = { error: 'GET User by id with no result.' };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: 'Error while retrieving the user.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

/**
 * @api {post} /api/v1/users/resetPassword/ resets the password of a user
 * @apiName resetPassword
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { object } an response object
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
 */
router.route('/resetPassword/').post((req, res) => {
  if (!req.body.email) {
    res.status(400).send({ error: 'Malformed Request! No Email given.' });
  } else {
    userCtrl.resetPassword(req.body.email).then((success) => {
      if (!success) {
        const msg = { error: 'Error while resetting the password.' };
        logger.error(msg);
        res.status(500).send(msg);
      }
      logger.info({ msg: `Password reset for user with e-mail address ${req.body.email}` });
      res.status(200).send({ msg: 'Password reset' });
    }).catch((err) => {
      const msg = { error: 'Error while resetting the password.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

router.route('/:id/changePassword').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    userCtrl.getUserById(req.params.id).then((user) => {
      if (user) {
        user.comparePassword(req.body.oldPassword, (err, isMatch) => {
          if (err) {
            const msg = { error: 'The current user password is not correct.' };
            logger.error(msg);
            res.status(401).send(msg);
          } else if (isMatch) {
            const msg = { msg: `User ${user._id} successfully changed his password.` };
            logger.error(msg);
            userCtrl.changePassword(user, req.body.newPassword);
            res.status(200).send(msg);
          } else {
            const msg = { error: 'Something bad happened' };
            logger.error(msg);
            res.status(404).send(msg);
          }
        });
      } else {
        const msg = { error: 'GET User by id with no result.' };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: 'Error while retrieving the user.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

export default router;
