import 'jasmine';
import * as request from 'request';
import * as configs from '../config';


const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Order Controller', () => {
  it('gets orders', (done) => {
    request.get(`${endpoint}orders/`, (error, response) => {
      const orders = JSON.parse(response.body).orders;
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
  status: 'new'
};

describe('Order Controller', () => {
  const testBody = JSON.parse(JSON.stringify(testOrder));
  it('create order', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      const orderResult = response.body.order;

      expect(response.statusCode).toEqual(200);
      expect(orderResult).toBeDefined();
      expect(orderResult.editor).toEqual(testBody.editor);
      expect(orderResult.owner).toEqual(testBody.owner);
      expect(orderResult.token).toBeDefined();
      expect(orderResult.status).toEqual(testBody.status);
      done();
    });
  });
});

describe('Order Controller', () => {
  const testBody = JSON.parse(JSON.stringify(testOrder));
  it('get order by id', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'GET',
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.order).toBeDefined();
        expect(response.body.order.editor).toEqual(testBody.editor);
        expect(response.body.order.owner).toEqual(testBody.owner);
        expect(response.body.order.token).toBeDefined();
        expect(response.body.order.status).toEqual(testBody.status);
        done();
      });
    });
  });
});

describe('Order Controller', () => {
  const testBody = JSON.parse(JSON.stringify(testOrder));
  it('update order', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      response.body.order.owner = 'Hans Peter';
      request({
        uri: `${endpoint}orders/updateOrder`,
        method: 'POST',
        json: true,
        body: response.body.order
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.order).toBeDefined();

        expect(response.body.order.owner).toEqual('Hans Peter');

        expect(response.body.order.token).toBeDefined();
        expect(response.body.order.editor).toEqual(testBody.editor);
        expect(response.body.order.status).toEqual(testBody.status);
        done();
      });
    });
  });
});

describe('Order Controller', () => {
  const testBody = JSON.parse(JSON.stringify(testOrder));
  it('delete order', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/deleteOrder`,
        method: 'POST',
        json: true,
        body: response.body.order
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.order).toBeDefined();

        expect(response.body.order.status).toEqual('deleted');

        expect(response.body.order.token).toBeDefined();
        expect(response.body.order.editor).toEqual(testBody.editor);
        done();
      });
    });
  });
});
