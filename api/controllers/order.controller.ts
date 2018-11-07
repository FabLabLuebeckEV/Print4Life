import * as uuid from 'uuid/v4';
import * as mongoose from 'mongoose';
import { isNumber } from 'util';

import { Order, orderSchema } from '../models/order.model';

function getOrders (query?: any, limit?: any, skip?: any) {
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

function getOrderById (id) {
  return Order.findOne({ _id: id });
}

function createOrder (order) {
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

function updateOrder (order) {
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

async function deleteOrder (id) {
  const order = await getOrderById(id);
  order.status = 'deleted';
  return updateOrder(order);
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

async function createComment (id, comment) {
  let ret;
  const order = await getOrderById(id);
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

function count (query) {
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
  getOrders,
  createOrder,
  updateOrder,
  getOrderById,
  deleteOrder,
  getStatus,
  createComment,
  count
};
