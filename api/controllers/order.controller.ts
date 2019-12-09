import logger from '../logger';
import validatorService from '../services/validator.service';
import { OrderService } from '../services/order.service';
import FileService from '../services/file.service';
import config from '../config/config';
/* eslint-disable no-unused-vars */
import { IError, ErrorType } from '../services/router.service';
import ScheduleService from '../services/schedule.service';
import Order, { searchableTextFields } from '../models/order.model';
import UserService from '../services/user.service';
/* eslint-enable no-unused-vars */

const orderService = new OrderService();
const fileService = new FileService();
const scheduleService = new ScheduleService();
const userService = new UserService();

/**
 * @api {get} /api/v1/orders/ Request the list of orders
 * @apiName GetOrders
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
    "orders": [
        {
            "machine": {
                "_id": "5b55f7bf3fe0c8b01713b3ff",
                "type": "Printer"
            },
            "fablabId": "5b73f77739bbd845df0cb2df",
            "status": "new",
            "_id": "5b73f77739bbd845df0cb2df",
            "projectname": "Comment Test",
            "comments": [
                {
                    "_id": "5b73f77739bbd845df0cb2e0",
                    "author": "Test",
                    "content": "Test Comment",
                    "createdAt": "2018-08-15T09:50:47.475Z"
                },
                {
                    "_id": "5b73f7a939bbd845df0cb2e1",
                    "author": "Blub",
                    "content": "Bla",
                    "createdAt": "2018-08-15T09:51:37.983Z"
                }
            ],
            "editor": "Test",
            "owner": "Test",
            "token": "87250a41-2587-40bf-8b09-bcd2a32b2c2d",
            "createdAt": "2018-08-15T09:50:47.475Z",
            "files": [],
            "fileCopyright": false,
            "__v": 1
        },
        {
            "machine": {
                "_id": "5b55f7bf3fe0c8b01713b3e5",
                "type": "Lasercutter"
            },
            "fablabId": "5b73f77739bbd845df0cb2df",
            "status": "new",
            "_id": "5b73f81f39bbd845df0cb2e2",
            "projectname": "Test 2 ",
            "comments": [
                {
                    "_id": "5b73f81f39bbd845df0cb2e3",
                    "author": "Test",
                    "content": "Blub",
                    "createdAt": "2018-08-15T09:53:35.043Z"
                }
            ],
            "editor": "Test",
            "owner": "Test",
            "token": "e9a42f99-5689-4563-98ec-721abb754ba5",
            "createdAt": "2018-08-15T09:53:35.043Z",
            "files": [],
            "fileCopyright": false,
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
      "error": "Error while trying to get all orders!",
      "stack": {
          ...
      }
  }
* @apiSuccessExample Success-Response:
*    HTTP/1.1 206 Partial Content
*    {
      "orders": [
        {
            owner: "User X",
            editor: "Editor Y",
            files: {[
                ...
            ]},
            "fileCopyright": false,
            status: "production",
            comments: [{
                    content: "Please print this.",
                    author: "User X"
                }, {
                    conten: "Okay, I will do this.",
                    author: "Editor Y"
                }
            ],
        }
      ]
    }
* @apiPermission none
*/
function getAll (req, res) {
  req.query = validatorService.checkQuery(req.query, searchableTextFields);
  orderService.getAll(undefined, req.query.limit, req.query.skip).then((orders) => {
    if (orders.length === 0) {
      logger.info('GET Orders without result');
      res.status(204).send();
    } else if (req.query.limit && req.query.skip) {
      logger.info(`GET Orders with partial result ${JSON.stringify(orders)}`);
      res.status(206).send({ orders });
    } else {
      logger.info(`GET Orders with results ${JSON.stringify(orders)}`);
      res.status(200).send({ orders });
    }
  }).catch((err) => {
    logger.error({ error: 'Error while trying to get all orders!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all orders!', stack: err });
  });
}

/**
* @api {post} /api/v1/orders/search Searches the Orders
* @apiName SearchOrders
* @apiVersion 1.0.0
* @apiGroup Orders
* @apiHeader (Needed Request Headers) {String} Content-Type application/json
*
* @apiParam query is the query object for mongoose
* @apiParamExample {json} Request-Example:
*
{
  "$or":
    [
      {
        "status": "new"
      },
      {
        "status": "deleted"
      }
    ]
}
* @apiSuccess {Object} count the number of orders
* @apiSuccessExample Success-Response:
*    HTTP/1.1 200 OK
{
  "orders": [{
    ...
  }]
}
* @apiSuccess {Object} count the number of orders
* @apiSuccessExample Success-Response:
*    HTTP/1.1 204 No-Content
{
  "orders": []
}
* @apiSuccess {Object} count the number of orders
* @apiSuccessExample Success-Response:
*    HTTP/1.1 206 Partial Content
{
  "orders": [{
    ...
  }]
}
*
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to search for a specific order with query:",
      "stack": {
          ...
      }
  }
* @apiPermission none
*/
function search (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query, searchableTextFields);
  orderService.getAll(req.body.query, req.body.limit, req.body.skip).then((orders) => {
    if (orders.length === 0) {
      logger.info(`POST search for orders with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ orders });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for orders with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds partial results ${JSON.stringify(orders)}`);
      res.status(206).send({ orders });
    } else {
      logger.info(`POST search for orders with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds results ${JSON.stringify(orders)}`);
      res.status(200).send({ orders });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific order with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific order with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
  });
}

/**
* @api {post} /api/v1/orders/count Counts the Orders
* @apiName CountOrders
* @apiVersion 1.0.0
* @apiGroup Orders
* @apiHeader (Needed Request Headers) {String} Content-Type application/json
*
* @apiParam query is the query object for mongoose
* @apiParamExample {json} Request-Example:
*
{
  "$or":
    [
      {
        "status": "new"
      },
      {
        "status": "deleted"
      }
    ]
}
* @apiSuccess {Object} count the number of orders
* @apiSuccessExample Success-Response:
*    HTTP/1.1 200 OK
{
   "count": 98
}
*
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while counting orders!",
      "stack": {
          ...
      }
  }
* @apiPermission none
*/
function count (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query, searchableTextFields);
  orderService.count(req.body.query).then((count) => {
    logger.info(`POST count with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error({ error: 'Error while counting orders!', err });
    res.status(500).send({ error: 'Error while counting orders!', err });
  });
}

/**
 * @api {post} /api/v1/orders/ Adds a new order
 * @apiName createOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {Object} machine simple object containing id and type of machine (required)
 * @apiParam {String} projectName name of the project (required)
 * @apiParam {Array} comments array of comment objects
 * @apiParam {String} editor name of assigned editor
 * @apiParam {String} owner name of owner of the order (required)
 *
 * @apiParamExample {json} Request-Example:
 * {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "fablabId": "5b73f77739bbd845df0cb2df",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test"
}
 *
 * @apiSuccess { Object } order the new order object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "status": "new",
        "_id": "5b7403e85b1ddf5847ee59f2",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "e6ae7bef-657e-48e7-9c3b-960407cd7164",
        "createdAt": "2018-08-15T10:43:52.291Z",
        "files": [],
        "fileCopyright": false,
        "__v": 0
    }
}
  * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed order, one or more parameters wrong or missing",
      "stack": {
          ...
      }
  }
 * @apiPermission none
 */
function create (req, res) {
  orderService.create(req.body).then((order) => {
    logger.info(`POST Order with result ${JSON.stringify(order)}`);
    res.status(201).send({ order });
  }).catch((err) => {
    logger.error({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
    res.status(400).send({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
  });
}

/**
 * @api {put} /api/v1/orders/:id Updates an order or creates it, if it doesn't exists yet.
 * @apiName updateOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {Object} machine simple object containing id and type of machine (required)
 * @apiParam {String} projectName name of the project (required)
 * @apiParam {Array} comments array of comment objects
 * @apiParam {String} editor name of assigned editor
 * @apiParam {String} status name of status of the order (required)
 * @apiParam {String} token uuid as token for the external login (required)
 * @apiParam {String} owner name of owner of the order (required)
 *
 * @apiParamExample {json} Request-Example:
 * {
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "fablabId": "5b73f77739bbd845df0cb2df",
        "status": "new",
        "_id": "5b73ff2e88ccd44a93dda7db",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "66b0997a-b467-49fd-a769-242fc37ce78d",
        "createdAt": "2018-08-15T10:23:42.852Z",
        "files": [],
        "fileCopyright": false,
        "__v": 0
    }
}
 * @apiSuccess { Object } order the updated order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
  {
  'order' : {
      'status' : 'new',
      '_id' : '5b55cf9730b4aa4bbeaf6f68',
      'comments' : [
          {
              '_id': '5b583da5514fac1bb10832b6',
              'author': 'Mister Foo',
              'content': 'Hello there, could you print this?'
          }
      ],
      'editor' : 'Mister Bar',
      'owner' : 'Mister X',
      'files' : [],
      'fileCopyright': false,
      'token' : '42',
      '__v' : 0;
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed update.",
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
 * @apiPermission owner
 */
async function update (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  const order = await orderService.get(req.params.id);

  const token = req.headers.authorization.split('JWT')[1].trim();
  const user = await userService.getUserByToken(token);

  if (user.role.role !== 'editor' && user.role.role !== 'admin' && user.id !== order.owner) {
    const msg = {
      err: 'FORBIDDEN',
      message: 'User can not update orders!'
    };

    return res.status(403).send(msg);
  }

  try {
    const order = await orderService.update(req.body);

    logger.info(`PUT Order with result ${JSON.stringify(order)}`);
    return res.status(200).send({ order });
  } catch (err) {
    logger.error({ error: 'Malformed update.', stack: err });
    return res.status(400).send({ error: 'Malformed update.', stack: err });
  }
}

/**
 * @api {delete} /api/v1/orders/:id Marks an order as deleted
 * @apiName deleteOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiSuccess { Object } order the deleted order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "fablabId": "5b73f77739bbd845df0cb2df",
        "status": "deleted",
        "_id": "5b73ff2e88ccd44a93dda7db",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "66b0997a-b467-49fd-a769-242fc37ce78d",
        "createdAt": "2018-08-15T10:23:42.852Z",
        "files": [],
        "fileCopyright": false,
        "__v": 0
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed Request!",
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
async function deleteById (req, res) {
  const token = req.headers.authorization.split('JWT')[1].trim();
  const user = await userService.getUserByToken(token);

  if (user.role.role !== 'editor' && user.role.role !== 'admin') {
    const msg = {
      err: 'FORBIDDEN',
      message: 'User can not delete orders!'
    };

    return res.status(403).send(msg);
  }

  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const order = await orderService.deleteById(req.params.id);
    logger.info(`DELETE Order with result ${JSON.stringify(order)}`);
    return res.status(200).send({ order });
  } catch (err) {
    logger.error({ error: 'Malformed Request!', stack: err });
    return res.status(400).send({ error: 'Malformed Request!', stack: err });
  }
}

/**
 * @api {get} /api/v1/orders/status Request all valid status
 * @apiName getStatus
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Object } status a list of valid status
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 * {
    "status": [
        "new",
        "assigned",
        "production",
        "shipment",
        "archived",
        "representive",
        "deleted"
    ]
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get all valid status!",
      "stack": {
          ...
      }
  }
 * @apiPermission none
 */
function getStatus (req, res) {
  orderService.getStatus().then((status) => {
    if (!status) {
      logger.info('GET status without result');
      res.status(204).send();
    } else {
      logger.info(`GET status with result ${JSON.stringify(status)}`);
      res.status(200).send({ status });
    }
  }).catch((err) => {
    logger.error({ error: 'Error while trying to get all valid status!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all valid status!', stack: err });
  });
}

/**
 * @api {get} /api/v1/orders/status/outstanding Request the outstanding status
 * @apiName getOutstandingStatus
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { Object } status a list containing the outstanding status
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 * {
    "status": [
        "representive"
    ]
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get the outstanding status!",
      "stack": {
          ...
      }
  }
 * @apiPermission none
 */
function getOutstandingStatus (req, res) {
  let found = false;
  let ret;
  orderService.getStatus().then((status: Array<String>) => {
    status.forEach((s) => {
      if (s === 'representive') {
        found = true;
        ret = s;
      }
    });
    if (found) {
      logger.info(`GET outstanding status with result ${JSON.stringify(ret)}`);
      res.status(200).send({ status: ret });
    } else {
      const msg = 'Outstanding Status not found!';
      logger.info(msg);
      res.status(204).send();
    }
  }).catch((err) => {
    const error = 'Error while trying to get the outstanding status!';
    logger.error({ error, stack: err });
    res.status(500).send({ error, stack: err });
  });
}

/**
 * @api {post} /api/v1/orders/:id/comment Adds a new comment to an order
 * @apiName createOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} author name of the writer of the comment (required)
 * @apiParam {String} content the content of the comment (required)
 *
 * @apiParamExample {json} Request-Example:
 {
    "author": "Test",
    "content": "Blub"
}

 * @apiSuccess { Object } comment the new comment object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
{
    "comment": {
        "timestamp": "2018-08-15T11:59:09.104Z",
        "author": "Test",
        "content": "Blub",
        "createdAt": "2018-08-15T11:59:09.133Z"
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "Could not find any Order with id 9999",
      "stack": {
          ...
      }
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed Request! Could not add comment to order.",
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
async function createComment (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const comment = await orderService.createComment(req.params.id, { timestamp: new Date(), ...req.body });
    if (!comment) {
      logger.error({ error: `Could not find any Order with id ${req.params.id}` });
      return res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
    }
    logger.info(`POST comment with result ${JSON.stringify(comment)}`);
    return res.status(201).send({ comment });
  } catch (err) {
    logger.error({ error: 'Malformed Request! Could not add comment to order.', stack: err });
    return res.status(400).send({ error: 'Malformed Request! Could not add comment to order.', stack: err });
  }
}

/**
 * @api {get} /api/v1/orders/:id Request an order by its id
 * @apiName getOrderById
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the order (required)
 * @apiSuccess { Object } order a single order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "fablabId": "5b73f77739bbd845df0cb2df",
        "status": "new",
        "_id": "5b73f81f39bbd845df0cb2e2",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "e9a42f99-5689-4563-98ec-721abb754ba5",
        "createdAt": "2018-08-15T09:53:35.043Z",
        "files": [],
        "fileCopyright": false,
        "__v": 0
    }
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "Could not find any Order with id 9999",
      "stack": {
          ...
      }
  }
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get Order with id 9999",
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
 * @apiPermission none (owner for address)
 */
async function get (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const order = await orderService.get(req.params.id);
    if (!order) {
      logger.error({ error: `Could not find any Order with id ${req.params.id}` });
      return res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
    }

    let authorized = false;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('JWT')[1].trim();
      const user = await userService.getUserByToken(token);

      authorized = user && (user.role.role === 'admin' || user.role.role === 'editor' || user.id === order.owner);
    }

    if (!authorized) {
      delete order.shippingAddress;
      order.shippingAddress = undefined;
    }

    logger.info(`GET Order with result ${JSON.stringify(order)}`);
    return res.status(200).send({ order });
  } catch (err) {
    logger.error({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
    return res.status(500).send({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
  }
}

/**
 * @api {get} /api/v1/orders/:id/schedule Gets the schedules of a specific order
 * @apiName getScheduleOfOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the order (required)
 *
 * @apiSuccess {Object} schedule the schedule object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "schedule": {
            "machine": {
                "type": "otherMachine",
                "id": "5bfe88759d1139444a95aa47"
            },
            "_id": "5bfe887e9d1139444a95aa7c",
            "startDate": "2018-11-29T12:22:12.076Z",
            "endDate": "2018-11-29T12:22:12.076Z",
            "fablabId": "5b453ddb5cf4a9574849e98a",
            "orderId": "5bfe88759d1139444a95aa48",
            "__v": 0
        },
    }
}
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiError 500 An Error occured
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
 *     {
 *       "error": "Error while trying to get schedules of Order!"
 *     }
 *
 *
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
async function getSchedule (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    const schedules = await scheduleService.getAll({ orderId: req.params.id }, '1', '0');
    logger.info(`GET schedules for Order with result ${JSON.stringify(schedules)}`);
    if (schedules.length) {
      return res.status(200).send({ schedule: schedules[0] });
    }
    const msg = 'No Schedule for Order found';
    logger.info(msg);
    return res.status(204).send();
  } catch (err) {
    const msg = 'Error while trying to get schedules of Order!';
    logger.error({ msg, stack: err.stack });
    return res.status(500).send({ error: msg });
  }
}

/**
 * @api {get} /api/v1/orders/:id/files/:fileId?token=:jwtToken Downloads a specific file of an order by its id
 * @apiName getFileOfOrderById
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the order (required)
 * @apiParam {String} fileId is the id of the file (required)
 * @apiParam {String} jwtToken is the jwt bearer token of the logged in user (required as query param)
 * @apiSuccess { Object } File the file as attachment
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
    <file_attachment>
*
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 400 Bad Request
  {
    "err": {
      "name": 'INVALID_ID',
      "message": 'Invalid fileID in URL parameter. '
        + 'Must be a single String of 12 bytes or a string of 24 hex characters',
      "stack": {
        ...
      },
      "type": "INVALID_ID"
    }
  }

* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 403 Forbidden
  {
    name: 'FORBIDDEN',
    message: 'Forbidden! You are not allowed to use this route.',
    type: ErrorType.FORBIDDEN
  }
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 500 Server Error
  {
        "error": {
          "name": 'DOWNLOAD_FILE_ERROR',
          "message": 'Invalid fileID in URL parameter. '
            + 'Must be a single String of 12 bytes or a string of 24 hex characters',
          "stack": {
            ...
          },
          "type": "DOWNLOAD_FILE_ERROR"
        };
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
async function downloadFile (req, res) {
  let err: IError;
  let file: any;
  let downloadStream: any;
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }

  try {
    const order = await orderService.get(req.params.id);
    if (!order.shared) {
      const tokenCheck = await validatorService.checkToken(req);
      if (!tokenCheck || !tokenCheck.decoded
        || (order.owner !== tokenCheck.decoded._id && tokenCheck.decoded.role.role !== 'admin'
          && tokenCheck.decoded.role.role !== 'editor')) {
        err = {
          name: 'FORBIDDEN',
          message: 'Forbidden! You are not allowed to use this route.',
          type: ErrorType.FORBIDDEN
        };
        return res.status(403).send(err);
      }
    }
    file = order.files.find((elem) => elem.id === req.params.fileId);
  } catch (error) {
    err = {
      name: 'INVALID_ID',
      message: 'Invalid fileID in URL parameter. '
        + 'Must be a single String of 12 bytes or a string of 24 hex characters',
      stack: error.stack,
      type: ErrorType.INVALID_ID
    };
    return res.status(400).send(err);
  }


  try {
    downloadStream = await fileService.downloadFile(req.params.fileId, config.attachmentBucket);
  } catch (err) {
    let statusCode = 500;
    if (err.type === ErrorType.INVALID_ID) {
      statusCode = 400;
    }
    return res.status(statusCode).send(err.error);
  }

  res.set('content-type', file.contentType);
  res.set('accept-ranges', 'bytes');
  res.set({
    'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`
  });

  downloadStream.on('end', () => {
    logger.info(`Done sending file with id ${file.id} to Requester`);
    res.end();
  });

  return downloadStream.pipe(res);
}

/**
 * @api {delete} /api/v1/orders/:id/files/:fileId?token=:jwtToken Deletes a specific file of an order by its id
 * @apiName deleteFileOfOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} id is the id of the order (required)
 * @apiParam {String} fileId is the id of the file (required)
 * @apiParam {String} jwtToken is the jwt bearer token of the logged in user (required as query param)
 * @apiSuccess { Object } File the file as attachment
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
  {
    "order": {
      ...
    }
  }
*
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 400 Bad Request
  {
    "err": {
      "name": 'INVALID_ID',
      "message": 'Invalid fileID in URL parameter. '
        + 'Must be a single String of 12 bytes or a string of 24 hex characters',
      "stack": {
        ...
      },
      "type": "INVALID_ID"
    }
  }

* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 403 Forbidden
  {
    name: 'FORBIDDEN',
    message: 'Forbidden! You are not allowed to use this route.',
    type: ErrorType.FORBIDDEN
  }
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 500 Server Error
  {
        "error": {
          "name": "DELETE_FILE_ERROR",
          "message": "Something went wrong while deleting the file with id adskamkdw13213ew" ,
          "type": "DELETE_FILE_ERROR"
        };
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
 * @apiPermission owner
 */
async function deleteFile (req, res) {
  let err: IError;
  let order: any;
  let result: { order: any };
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }

  try {
    order = await orderService.get(req.params.id);
    if (!order.shared) {
      const tokenCheck = await validatorService.checkToken(req);
      if (!tokenCheck || !tokenCheck.decoded
        || (order.owner !== tokenCheck.decoded._id && tokenCheck.decoded.role.role !== 'admin'
          && tokenCheck.decoded.role.role !== 'editor')) {
        err = {
          name: 'FORBIDDEN',
          message: 'Forbidden! You are not allowed to use this route.',
          type: ErrorType.FORBIDDEN
        };
        return res.status(403).send(err);
      }
    }
  } catch (error) {
    err = {
      name: 'INVALID_ID',
      message: 'Invalid fileID in URL parameter. '
        + 'Must be a single String of 12 bytes or a string of 24 hex characters',
      stack: error.stack,
      type: ErrorType.INVALID_ID
    };
    return res.status(400).send(err);
  }


  try {
    result = await fileService.deleteFile(req.params.fileId, config.attachmentBucket, order);
  } catch (err) {
    let statusCode = 500;
    if (err.type === ErrorType.INVALID_ID) {
      statusCode = 400;
    }
    return res.status(statusCode).send(err.error);
  }

  if (result && result.order) {
    await orderService.update(order);
    return res.status(200).send({ order });
  }
  err = {
    name: 'DELETE_FILE_ERROR',
    message: `Something went wrong while deleting the file with id ${req.params.fileId}`,
    type: ErrorType.DELETE_FILE_ERROR
  };
  return res.status(500).send(err);
}


/**
 * @api {post} /api/v1/orders/:id/files/:fileid/gallery Select gallery pictures
 * @apiName addFileToOrderGallery
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type form-data/multipart
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {Boolean} gallery is the file supposed to be in the gallery
 *
 * @apiParamExample {json} Request-Example:
 {
    "gallery": true
 }
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
  {
      "error": "Could not find any Order with id 9999",
      "stack": {
          ...
      }
  }
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 400 Not Found
  {
      "error": "Could not find any File with id 9999",
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
async function addGallery (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);

  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }

  const order = await orderService.get(req.params.id);
  const file = order.files.find((f) => f.id === req.params.fileId);
  if (!file) {
    return res.status(404).send({ message: 'Requested File could not be found' });
  }

  if (file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
    if (req.body.gallery) {
      order.files.forEach((file) => {
        file.gallery = false;
      });
    }
    file.gallery = req.body.gallery;

    await Order.update(order);

    return res.status(204).send();
  }
  return res.status(400).send({ message: 'File type not suitable for gallery' });
}

/**
 * @api {post} /api/v1/orders/:id/files Uploads file(s) to an order
 * @apiName uploadFileToOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type form-data/multipart
 * @apiHeader (Needed Request Headers) {String} Authorization valid JWT Token
 *
 * @apiParam {String} file file object uploaded through form data.
 * Can contain multiple files under the name 'file' (required)
 * @apiParam {String} id the id of the order
 *
 * @apiParamExample {json} Request-Example:
 {
    "file": <File Object>,
    "file": <File Object>
}
 * @apiSuccess { Object } uploaded the uploaded files
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "uploaded": {
        "files": [
            {
                "id": "5bf3d4364b21bf21ee3be37b",
                "contentType": "text/plain",
                "filename": "Faust.txt",
                "createdAt": "2018-11-20T09:30:30.000Z"
            },
            {
                "id": "5bf3d4364b21bf21ee3be37c",
                "contentType": "application/pdf",
                "filename": "Dream-Walker.pdf",
                "createdAt": "2018-11-20T09:30:30.000Z"
            }
        ],
        "success": true
    }
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
  {
      "error": "Could not find any Order with id 9999",
      "stack": {
          ...
      }
  }
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 404 Not Found
  {
      "error": "No files present"
  }
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 500 Server Error
  {
      "message": "Error while uploading!"
  }
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 500 Server Error
  {
      "message": "Error while uploading!",
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
function uploadFile (req, res) {
  const promises = [];
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (!req.files) {
    return res.status(400).send({ message: 'No files present' });
  }

  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }

  req.files.forEach(async (file) => {
    promises.push(fileService.uploadFile(file, config.attachmentBucket, req.params.id));
  });

  return Promise.all(promises).then(async (results) => {
    let error = false;
    const files = [];
    results.forEach((result) => {
      if (!result.success) {
        error = true;
      } else {
        files.push(
          {
            id: result.fileId,
            contentType: result.contentType,
            filename: result.filename,
            createdAt: result.createdAt
          }
        );
      }
    });
    if (error) {
      return res.status(500).send({ message: 'Error while uploading!' });
    }
    try {
      const order = await orderService.get(req.params.id);
      order.files.forEach((file) => {
        const found = files.find((f) => file.filename === f.filename && file.contentType === f.contentType);
        if (found) {
          file.deprecated = true;
        }
      });
      order.files = order.files.concat(files);
      await orderService.update(order);
      return res.status(200).send({
        uploaded: {
          files,
          success: true
        }
      });
    } catch (error) {
      return res.status(500).send({ message: 'Error while uploading!', stack: error.stack });
    }
  }).catch((error) => {
    if (error.message === 'File unsave') {
      res.status(406).send({ message: 'File not save for uploading' });
      return;
    }
    res.status(500).send({ message: 'Error while uploading!', stack: error.stack });
  });
}

export default {
  getAll,
  create,
  update,
  get,
  deleteById,
  getOutstandingStatus,
  getStatus,
  createComment,
  count,
  search,
  uploadFile,
  downloadFile,
  deleteFile,
  getSchedule,
  addGallery
};
