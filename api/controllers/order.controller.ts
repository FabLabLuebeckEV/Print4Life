import * as uuid from 'uuid/v4';
import * as mongoose from 'mongoose';

import { Order, orderSchema } from '../models/order.model';

/**
 * @api {get} /api/v1/orders/ Request the list of orders
 * @apiName GetOrders
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Array} orders an array of order objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
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
function getOrders () {
  return Order.find((err, orders) => {
    if (err) {
      return err;
    } else if (orders) {
      return orders;
    }
    return [];
  });
}

/**
 * @api {get} /api/v1/orders/:id Request an order by its id
 * @apiName getOrderById
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { order } a single order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *  {
    "order": {
        "status": "new",
        "_id": "5b55cf9730b4aa4bbeaf6f68",
        "comments": [
            {
                "_id": "5b583da5514fac1bb10832b6",
                "author": "Mister Foo",
                "content": "Hello there, could you print this?"
            }
        ],
        "editor": "Mister Bar",
        "owner": "Mister X",
        "files": [],
        "token": "42",
        "__v": 0
    }
}
 */
function getOrderById (id) {
  return Order.findOne({ _id: id });
}

/**
 * @api {post} /api/v1/orders/placeOrder Adds a new order
 * @apiName placeOrder
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { order } the new order object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
  {
    "order": {
        "status": "new",
        "_id": "5b58401ee7e9a1240d4b09ce",
        "comments": [
            {
                "_id": "5b58401ee7e9a1240d4b09cf",
                "author": "Mister Foo",
                "content": "Hello there, could you print this?"
            }
        ],
        "editor": "Mister Bar",
        "owner": "Mister X",
        "files": [],
        "token": "42",
        "__v": 0
    }
  }
 */
function placeOrder (order) {
  order.token = uuid();
  return Order(rmDbVars(order)).save();
}

/**
 * @api {post} /api/v1/orders/updateOrder Updates an order
 * @apiName updateOrder
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
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
 *     HTTP/1.1 400 Bad Request
  {
      "error": "Order not found or malformed update.",
      "stack": {
          "message": "Cast to ObjectId failed for value \"BADID\" at path \"_id\" for model \"Order\"",
          "name": "CastError",
          "stringValue": "\"BADID\"",
          "kind": "ObjectId",
          "value": "BADID",
          "path": "_id"
      }
  }
 */
function updateOrder (order) {
  delete order.__v;
  return Order.update(
    { _id: mongoose.Types.ObjectId(order._id) },
    order,
    { upsert: true }).then(() => Order.findOne({ _id: order._id }));
}

/**
 * @api {delete} /api/v1/orders/deleteOrder Marks an order as deleted
 * @apiName delteOrder
 * @apiVersion 0.0.1
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { order } the deleted order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
  {
  'order'; : {
      'status'; : 'deleted',
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
 *     HTTP/1.1 400 Bad Request
  {
      "error": "Order not found.",
      "stack": {
          "message": "Cast to ObjectId failed for value \"BADID\" at path \"_id\" for model \"Order\"",
          "name": "CastError",
          "stringValue": "\"BADID\"",
          "kind": "ObjectId",
          "value": "BADID",
          "path": "_id"
      }
  }
 */
async function deleteOrder (id) {
  const order = await getOrderById(id);
  order.status = 'deleted';
  return updateOrder(order);

  //   return Order.findOne({ _id: id }).then((order) => {
  //     order.status = 'deleted';
  //     delete order.__v;
  //     return Order.update({ order }, order, { upsert: true }).then(() => Order.findOne({ _id: order._id }));
  //   });
  //   order.status = 'deleted';
  //   delete order.__v;
  //   return Order.update({ _id: order._id }, order, { upsert: true }).then(() => Order.findOne({ _id: order._id }));
}

async function getStatus () {
  return new Promise((resolve, reject) => {
    const status = orderSchema.paths.status.enumValues;
    if (status === undefined) {
      reject();
    } else {
      resolve(status);
    }
  });
}

async function addComment (id, comment) {
  const order = await getOrderById(id);
  order.comments.push(comment);
  await order.save();
  return comment;
}

function rmDbVars (obj) {
  delete obj.__v;
  delete obj._id;
  return obj;
}

export default {
  getOrders,
  placeOrder,
  updateOrder,
  getOrderById,
  deleteOrder,
  getStatus,
  addComment
};
