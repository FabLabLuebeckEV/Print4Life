import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

import logger from '../logger';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Order Controller', () => {
  it('gets orders', (done) => {
    request.get(`${endpoint}orders/`, (error, response) => {
      const orders = JSON.parse(response.body).orders;
      logger.log(JSON.stringify(orders, null, 2));
      expect(response.statusCode).toEqual(200);
      expect(orders).toBeDefined();
      expect(orders.length).toBeGreaterThan(-1);
      done();
    });
  });
});

const testOrder = {
  comments: [{
    author: 'Mister Foo',
    content: 'Hello there, could you print this?'
  }],
  editor: 'Mister Bar',
  owner: 'Mister Foo',
  files: [],
  status: 'new',
  token: '42'
};

let orderResult;

describe('Order Controller', () => {
  it('create order', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testOrder
    }, (error, response) => {
      orderResult = response.body.order;

      expect(response.statusCode).toEqual(200);
      expect(orderResult).toBeDefined();
      expect(orderResult.editor).toEqual(testOrder.editor);
      expect(orderResult.owner).toEqual(testOrder.owner);
      expect(orderResult.token).toEqual(testOrder.token);
      expect(orderResult.status).toEqual(testOrder.status);
      done();
    });
  });
});

describe('Order Controller', () => {
  it('get all orders', (done) => {
    request({
      uri: `${endpoint}orders/`,
      method: 'GET',
      json: true,
      body: {}
    }, (error, response) => {
      const orders = response.body.orders;

      expect(response.statusCode).toEqual(200);
      expect(orders).toBeDefined();
      expect(orders).toBeDefined();
      expect(orders.length).toBeGreaterThan(-1);
      done();
    });
  });
});

describe('Order Controller', () => {
  it('get order by id', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testOrder
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'GET',
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.order).toBeDefined();
        expect(response.body.order.editor).toEqual(testOrder.editor);
        expect(response.body.order.owner).toEqual(testOrder.owner);
        expect(response.body.order.token).toEqual(testOrder.token);
        expect(response.body.order.status).toEqual(testOrder.status);
        done();
      });
    });
  });
});

describe('Order Controller', () => {
  it('update order', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testOrder
    }, (error, response) => {
      response.body.order.owner = 'Hans Peter';
      request({
        uri: `${endpoint}orders/updateOrder`,
        method: 'POST',
        json: true,
        body: response.body.order
      }, (error, response) => {
        const updatedOrder = response.body.order;

        expect(response.statusCode).toEqual(200);
        expect(updatedOrder).toBeDefined();

        expect(updatedOrder.owner).toEqual('Hans Peter');

        expect(updatedOrder.token).toEqual(testOrder.token);
        expect(updatedOrder.editor).toEqual(testOrder.editor);
        expect(updatedOrder.status).toEqual(testOrder.status);
        done();
      });
    });
  });
});

describe('Order Controller', () => {
  it('delete order', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testOrder
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/deleteOrder`,
        method: 'POST',
        json: true,
        body: response.body.order
      }, (error, response) => {
        const updatedOrder = response.body.order;

        expect(response.statusCode).toEqual(200);
        expect(updatedOrder).toBeDefined();

        expect(updatedOrder.status).toEqual('deleted');

        expect(updatedOrder.token).toEqual(testOrder.token);
        expect(updatedOrder.editor).toEqual(testOrder.editor);
        done();
      });
    });
  });
});
