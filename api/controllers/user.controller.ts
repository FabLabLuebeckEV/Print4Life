import * as jwt from 'jsonwebtoken';

import { User } from '../models/user.model';
import { Role, roleSchema } from '../models/role.model';
import config from '../config/config';

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
    if (isMatch && !err) {
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

export default {
  signUp,
  getRoles,
  login,
  getUserByUsername,
  getUserById,
  getUserByToken
};
