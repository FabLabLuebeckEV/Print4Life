import * as jwt from 'jsonwebtoken';

import { User } from '../models/user.model';
import { Role, roleSchema } from '../models/role.model';
import { JWT } from '../models/jwt.model';
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
  const role = new Role({ role: user.role });
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
      if (user.jwt && user.jwt.issuedAt &&
        (new Date()).valueOf() - user.jwt.issuedAt.valueOf() < config.jwtExpiryTime) {
        resolve({ success: true, token: `JWT ${user.jwt.token}` });
      } else {
        const token = jwt.sign(user.toJSON(), config.jwtSecret);
        user.jwt = new JWT({ token, issuedAt: new Date() });
        user.save()
          .then(() => {
            resolve({ success: true, token: `JWT ${token}` });
          }).catch((err) => {
            reject({ success: false, msg: 'Saving JWT failed', stack: err });
          });
      }
    } else {
      reject({ success: false, msg: 'Authentication failed. Wrong password.' });
    }
  }));
}

async function getUserByUsername (username) {
  return User.findOne({ username });
}

async function getUserById (id) {
  return User.findById(id);
}

export default {
  signUp,
  getRoles,
  login,
  getUserByUsername,
  getUserById
};
