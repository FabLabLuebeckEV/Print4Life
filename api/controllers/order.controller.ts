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
      return onvrdisplaypointerrestricted;
    }
    return [];
  });
}

function getOrderById (id) {
    const query = new Order.findOne({ _id: id});
    return query.exec();
}

function placeOrder (newOrder) {
    const order = new Order(newOrder);
    return order.save();
}

async function updateOrder (body) {
    return Order.findOneAndUpdate({ _id: body._id }, body, {upsert: true} ).exec();
}

export default {
    getOrders,
    placeOrder,
    updateOrder,
    getOrderById
 };
