import * as jwt from 'jsonwebtoken';
import { isNumber } from 'util';
import { User } from '../models/user.model';
import { Role, roleSchema } from '../models/role.model';
import config from '../config/config';
/* eslint-disable no-unused-vars */
import emailService, { EmailOptions } from '../services/email.service';
import { ErrorType } from '../services/router.service';
/* eslint-enable no-unused-vars */

/**
 * @api {post} /api/v1/users/ Adds a new order
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
async function signUp (user) {
  delete user._id;
  delete user.__v;
  user.createdAt = new Date();
  const newUser = new User({
    ...user
  });
  const role = new Role();
  if (user.role) {
    role.role = user.role.role;
  }
  newUser.role = role;
  newUser.activated = user.activated || false;
  newUser.preferredLanguage = newUser.preferredLanguage || 'en';
  return newUser.save();
}

/**
 * @api {get} /api/v1/users/roles Request all valid status
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
async function getRoles () {
  return new Promise((resolve, reject) => {
    const roles = roleSchema.paths.role.enumValues;
    if (roles === undefined) {
      reject();
    } else {
      resolve(roles);
    }
  });
}


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
function login (user, password): Promise<Object> {
  return new Promise((resolve, reject) => user.comparePassword(password, (err, isMatch) => {
    if (isMatch && !err && user.activated) {
      const signObj = {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        address: user.address ? user.address.toJSON() : undefined,
        password: user.password,
        role: user.role.toJSON(),
        createdAt: user.createdAt
      };
      const token = jwt.sign(signObj, config.jwtSecret, { expiresIn: config.jwtExpiryTime });
      resolve({ success: true, token: `JWT ${token}` });
    } else if (!user.activated) {
      reject(
        {
          type: ErrorType.USER_DEACTIVATED,
          success: false,
          data: { userId: user._id },
          msg: 'Your account is not activated.'
        });
    } else {
      reject({ success: false, msg: 'Authentication failed. Wrong password.' });
    }
  }));
}

async function getUserByUsername (username) {
  return User.findOne({ username });
}

/**
 * @api {post} /api/v1/users/:id gets a user by its id
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
async function getUserById (id) {
  return User.findById(id);
}

/**
 * @api {post} /api/v1/users/findown gets the logged in user
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
async function getUserByToken (token) {
  const decoded = await jwt.verify(token, config.jwtSecret);
  return getUserById(decoded._id);
}

function informAdmins (user, newUser: boolean) {
  let options: EmailOptions;
  if (!user.activated) {
    options = {
      preferredLanguage: '',
      template: 'activateNewUser',
      to: '',
      locals:
      {
        adminName: '',
        userName: `${user.firstname} ${user.lastname}`,
        userEmail: user.email,
        id: user._id,
        url: `${config.baseUrlFrontend}/users/edit/${user._id}`,
        newUser
      }
    };
    User.find({ 'role.role': 'admin' }).then((admins) => {
      admins.forEach((admin) => {
        options.to = admin.email;
        options.preferredLanguage = admin.preferredLanguage || 'en';
        options.locals.adminName = `${admin.firstname} ${admin.lastname}`;
        emailService.sendMail(options);
      });
    });
  }
}

/**
 * @api {get} /api/v1/users/ Request the list of users
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
            "preferredLanguage": "en",
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
            "preferredLanguage": "en",
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
            "preferredLanguage": "en",
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
            "preferredLanguage": "en",
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
            "preferredLanguage": "en",
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
            "preferredLanguage": "en",
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
            "preferredLanguage": "en",
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
            "preferredLanguage": "en",
            "createdAt": "2018-10-12T06:53:34.419Z",
            "__v": 0
        }
      ]
    }
*/
function getUsers (query?: any, limit?: any, skip?: any) {
  let l: Number;
  let s: Number;
  let promise;
  if ((limit && skip) || (isNumber(limit) && isNumber(skip))) {
    l = Number.parseInt(limit, 10);
    s = Number.parseInt(skip, 10);
    query ? promise = User.find(query).limit(l).skip(s) : promise = User.find(query).limit(l).skip(s);
  } else {
    query ? promise = User.find(query) : promise = User.find();
  }
  return promise;
}

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
function count (query) {
  return User.countDocuments(query);
}

export default {
  signUp,
  informAdmins,
  getRoles,
  login,
  getUserByUsername,
  getUserById,
  getUserByToken,
  getUsers,
  count
};
