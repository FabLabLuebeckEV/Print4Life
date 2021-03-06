import * as uuid from 'uuid/v4';
import * as mongoose from 'mongoose';
import { isNumber } from 'util';
import { Order, orderSchema } from '../models/order.model';
// import config from '../config/config';
/* eslint-disable no-unused-vars */
import ModelService from './model.service';
// import FileService from './file.service';
/* eslint-enable no-unused-vars */

// const doneStatus: String[] = ['deleted', 'completed', 'archived', 'representive'];
// const fileService = new FileService();

export class OrderService implements ModelService {
  /* eslint-disable class-methods-use-this */
  /**
       * This method gets all orders. The result can be limited as well as some items skipped
       * @param limit is the limit of items to get
       * @param skip is the amount of items to skip (counted from the beginning)
       * @returns a promise with the results
       */
  public getAll (query?: any, limit?: any, skip?: any) {
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

  /**
       * This method gets an order by its id
       * @param id is the id of the order
       * @returns a promise with the results
       */
  public get (id) {
    return Order.findOne({ _id: id });
  }

  /**
       * This method creates a new order
       * @param params are the params for the order
       * @returns a promise with the results
       */
  public create (order) {
    order.token = uuid();
    order.createdAt = new Date();
    if (order.comments) {
      order.comments.forEach((comment) => {
        if (!comment.createdAt) {
          comment.createdAt = order.createdAt;
        }
      });
    }
    return Order(this.rmDbVars(order)).save();
  }

  /**
       * This method updates an order
       * @param id is the id of the order
       * @param machine is the machine obj that updates the order
       * @returns a promise with the results
       */
  public async update (order) {
    let isDone;
    delete order.__v;
    if (!order.createdAt) {
      order.createdAt = new Date();
    }
    let countfinished = 0;
    order.batch.finished.forEach((fin) => {
      countfinished += fin.number;
    });
    if (order.batch.number <= countfinished) {
      isDone = true;
    }
    /* doneStatus.forEach((status) => {
      if (status === order.status) {
        isDone = true;
      }
    }); */
    if (isDone) {
      // order.status = "in progress";
      order.status = 'closed';
    } else if (order.batch.finished.length > 0 || order.batch.accepted.length > 0) {
      order.status = 'in progress';
    } else {
      // update here to enable canceling an order
      order.status = 'open';
    }
    // delete deprecated files if order is done (archived, representive, completed, deleted)
    /* if (isDone && order.files) {
      let latestFiles = order.files;
      //eslint-disable no-restricted-syntax
      // eslint-disable no-await-in-loop
      for (const file of order.files) {
        if (file.deprecated) {
          const result = await fileService.deleteFile(file.id, config.attachmentBucket, order);
          if (result && result.order) {
            latestFiles = result.order.files;
          }
        }
      }
      // eslint-enable no-restricted-syntax
      // eslint-enable no-await-in-loop
      order.files = latestFiles;
    } */
    return Order.updateOne(
      { _id: mongoose.Types.ObjectId(order._id) },
      order,
      { upsert: true }
    ).then(() => Order.findOne({ _id: order._id }));
  }

  /**
       * This method deletes an order by its id
       * @returns a promise with the result
       */
  public async deleteById (id) {
    const order = await this.get(id);
    order.status = 'deleted';
    return this.update(order);
  }

  /**
       * This method gets all status for orders
       * @returns a promise with the result
       */
  public async getStatus () {
    return new Promise((resolve, reject) => {
      const status = orderSchema.paths.status.enumValues;
      if (status === undefined) {
        reject();
      } else {
        resolve(status);
      }
    });
  }

  /**
       * This method creates a new comment for an order
       * @param id is the id of the order
       * @param comment is the new comment
       * @returns a promise with the result
       */
  public async createComment (id, comment) {
    let ret;
    const order = await this.get(id);
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

  /**
      * This method counts all orders
       * @returns a promise with the result
       */
  public count (query) {
    return Order.countDocuments(query);
  }

  /**
       * Deletes the MongoDB vars not needed for updates etc.
       * obj is the obj where the DbVars should be deleted
       * @returns obj is the cleaned object
       */
  public rmDbVars (obj) {
    delete obj.__v;
    delete obj._id;
    return obj;
  }
  /* eslint-enable class-methods-use-this */
}

export default OrderService;
