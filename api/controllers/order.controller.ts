import * as mongoose from 'mongoose';

import logger from '../logger';
import orderSchema from '../models/order.model';

const Order = mongoose.model('Order', orderSchema);

/**
 * @api {get} /api/v1/orders/ Request the list of orders
 * @apiName GetOrders
 * @apiVersion 0.0.1
 * @apiGroup Orders
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
      return logger.error(err);
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
function placeOrder (newOrder) {
  return Order(rmDbVars(newOrder)).save();
}

/**
 * @api {post} /api/v1/orders/updateOrder Updates an order
 * @apiName updateOrder
 * @apiVersion 0.0.1
 * @apiGroup Orders
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
  return Order.update({ _id: order._id }, order, { upsert: true }).then(() => Order.findOne({ _id: order._id }));
}

/**
 * @api {post} /api/v1/orders/deleteOrder Marks an order as deleted
 * @apiName delteOrder
 * @apiVersion 0.0.1
 * @apiGroup Orders
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
function deleteOrder (order) {
  order.status = 'deleted';
  return updateOrder(order);
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
  deleteOrder
};
