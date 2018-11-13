import * as uuid from 'uuid/v4';
import * as mongoose from 'mongoose';
import { isNumber } from 'util';

import { Order, orderSchema } from '../models/order.model';
import logger from '../logger';
import validatorService from '../services/validator.service';

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
            "__v": 1
        },
        {
            "machine": {
                "_id": "5b55f7bf3fe0c8b01713b3e5",
                "type": "Lasercutter"
            },
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
*/
function getAll (req, res) {
  req.query = validatorService.checkQuery(req.query);
  _getAll(undefined, req.query.limit, req.query.skip).then((orders) => {
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
*/
function search (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query);
  _getAll(req.body.query, req.body.limit, req.body.skip).then((orders) => {
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
*/
function count (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query);
  _count(req.body.query).then((count) => {
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
 * @apiSuccess { order } the new order object, if success
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
 */
function create (req, res) {
  _create(req.body).then((order) => {
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
        "__v": 0
    }
}
 * @apiSuccess { order } the updated order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
  {
  'order'; : {
      'status'; : 'new',
      '_id'; : '5b55cf9730b4aa4bbeaf6f68',
      'comments'; : [
          {
              '_id': '5b583da5514fac1bb10832b6',
              'author': 'Mister Foo',
              'content': 'Hello there, could you print this?'
          }
      ],
      'editor'; : 'Mister Bar',
      'owner'; : 'Mister X',
      'files'; : [],
      'token'; : '42',
      '__v'; : 0;
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed update.",
      "stack": {
          ...
      }
  }
 */
function update (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    _update(req.body).then((order) => {
      logger.info(`PUT Order with result ${JSON.stringify(order)}`);
      res.status(200).send({ order });
    }).catch((err) => {
      logger.error({ error: 'Malformed update.', stack: err });
      res.status(400).send({ error: 'Malformed update.', stack: err });
    });
  }
}

/**
 * @api {delete} /api/v1/orders/:id Marks an order as deleted
 * @apiName deleteOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { order } the deleted order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
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
 */
function deleteById (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    _deleteById(req.params.id).then((order) => {
      logger.info(`DELETE Order with result ${JSON.stringify(order)}`);
      res.status(200).send({ order });
    }).catch((err) => {
      logger.error({ error: 'Malformed Request!', stack: err });
      res.status(400).send({ error: 'Malformed Request!', stack: err });
    });
  }
}

/**
 * @api {get} /api/v1/orders/status Request all valid status
 * @apiName getStatus
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { status } a list of valid status
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
 */
function getStatus (req, res) {
  _getStatus().then((status) => {
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

 * @apiSuccess { comment } the new comment object, if success
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
 */
function createComment (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    _createComment(req.params.id, { timestamp: new Date(), ...req.body }).then((comment) => {
      if (!comment) {
        logger.error({ error: `Could not find any Order with id ${req.params.id}` });
        res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
      } else {
        logger.info(`POST comment with result ${JSON.stringify(comment)}`);
        res.status(201).send({ comment });
      }
    }).catch((err) => {
      logger.error({ error: 'Malformed Request! Could not add comment to order.', stack: err });
      res.status(400).send({ error: 'Malformed Request! Could not add comment to order.', stack: err });
    });
  }
}

/**
 * @api {get} /api/v1/orders/:id Request an order by its id
 * @apiName getOrderById
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { order } a single order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
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
 */
function get (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    _get(req.params.id).then((order) => {
      if (!order) {
        logger.error({ error: `Could not find any Order with id ${req.params.id}` });
        res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
      } else {
        logger.info(`GET Order with result ${JSON.stringify(order)}`);
        res.status(200).send({ order });
      }
    }).catch((err) => {
      logger.error({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
      res.status(500).send({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
    });
  }
}

function upload (req, res) {
  // TODO: Implement Schema and Model for Attachments / Files and relate them to a specific order
  // TODO: Handle upload of the same file (maybe method PUT? and check for filename and order id)
  if (!req.files) {
    return res.send({
      success: false
    });
  }
  return res.send({
    success: true
  });
}

function _getAll (query?: any, limit?: any, skip?: any) {
  let l: Number;
  let s: Number;
  let promise;
  if ((limit && skip) || (isNumber(limit) && isNumber(skip))) {
    l = Number.parseInt(limit, 10);
    s = Number.parseInt(skip, 10);
    query ? promise = Order.find(query).limit(l).skip(s) : promise = Order.find(query).limit(l).skip(s);
  } else {
    query ? promise = Order.find(query) : promise = Order.find();
  }
  return promise;
}

function _get (id) {
  return Order.findOne({ _id: id });
}

function _create (order) {
  order.token = uuid();
  order.createdAt = new Date();
  if (order.comments) {
    order.comments.forEach((comment) => {
      if (!comment.createdAt) {
        comment.createdAt = order.createdAt;
      }
    });
  }
  return Order(_rmDbVars(order)).save();
}

function _update (order) {
  delete order.__v;
  if (!order.createdAt) {
    order.createdAt = new Date();
  }
  return Order.update(
    { _id: mongoose.Types.ObjectId(order._id) },
    order,
    { upsert: true }
  ).then(() => Order.findOne({ _id: order._id }));
}

async function _deleteById (id) {
  const order = await _get(id);
  order.status = 'deleted';
  return _update(order);
}

async function _getStatus () {
  return new Promise((resolve, reject) => {
    const status = orderSchema.paths.status.enumValues;
    if (status === undefined) {
      reject();
    } else {
      resolve(status);
    }
  });
}

async function _createComment (id, comment) {
  let ret;
  const order = await _get(id);
  if (order) {
    comment.createdAt = new Date();
    order.comments.push(comment);
    await order.save();
    ret = comment;
  } else {
    ret = undefined;
  }
  return ret;
}

function _count (query) {
  return Order.countDocuments(query);
}

/**
 * Deletes the MongoDB vars not needed for updates etc.
 * obj is the obj where the DbVars should be deleted
 * @returns obj is the cleaned object
 */
function _rmDbVars (obj) {
  delete obj.__v;
  delete obj._id;
  return obj;
}

export default {
  getAll,
  create,
  update,
  get,
  deleteById,
  getStatus,
  createComment,
  count,
  search,
  upload
};
