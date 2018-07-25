import * as mongoose from 'mongoose';

import logger from '../logger';
import orderSchema from '../models/order.model';

const Order = mongoose.model('Order', orderSchema);

/**
 * @api {get} /api/v1/order Request the list of orders
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

function getOrderById (id) {
  return Order.findOne({ _id: id });
}

function placeOrder (newOrder) {
  return Order(newOrder).save();
}

function updateOrder (order) {
  delete order.__v;
  return Order.update({ _id: order._id }, order, { upsert: true }).then(() => Order.findOne({ _id: order._id }));
}

function deleteOrder (order) {
  order['status'] = 'deleted';
  return updateOrder(order);
}

export default {
  getOrders,
  placeOrder,
  updateOrder,
  getOrderById,
  deleteOrder
};
