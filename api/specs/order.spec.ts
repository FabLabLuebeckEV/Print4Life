import 'jasmine';
import * as request from 'request';
import * as configs from '../config';


const endpoint = configs.configArr.prod.baseUrlBackend;

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
  it('gets orders', (done) => {
    request.get(`${endpoint}orders/`, { headers: { 'content-type': 'application/json' } },
      (error, response) => {
        const orders = JSON.parse(response.body).orders;
        expect(response.statusCode).toEqual(200);
        expect(orders).toBeDefined();
        expect(orders.length).toBeGreaterThan(-1);
        done();
      });
  });

  it('create order', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOrder));
    request({
      uri: `${endpoint}orders/`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      const orderResult = response.body.order;

      expect(response.statusCode).toEqual(201);
      expect(orderResult).toBeDefined();
      expect(orderResult.editor).toEqual(testBody.editor);
      expect(orderResult.owner).toEqual(testBody.owner);
      expect(orderResult.token).toBeDefined();
      expect(orderResult.status).toEqual(testBody.status);
      done();
    });
  });

  it('get order by id', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOrder));
    request({
      uri: `${endpoint}orders/`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'GET',
        headers: { 'content-type': 'application/json' },
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

  it('update order', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOrder));
    request({
      uri: `${endpoint}orders/`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      response.body.order.owner = 'Hans Peter';
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'PUT',
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

  it('delete order', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOrder));
    request({
      uri: `${endpoint}orders/`,
      method: 'POST',
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        json: true
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

  it('gets status', (done) => {
    request({
      uri: `${endpoint}orders/status`,
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toBeDefined();
      expect(response.body.status.length).toBeGreaterThan(0);

      expect(response.body.status.includes('new')).toEqual(true);
      expect(response.body.status.includes('assigned')).toEqual(true);
      expect(response.body.status.includes('production')).toEqual(true);
      expect(response.body.status.includes('shipment')).toEqual(true);
      expect(response.body.status.includes('archived')).toEqual(true);
      expect(response.body.status.includes('representive')).toEqual(true);
      expect(response.body.status.includes('deleted')).toEqual(true);
      done();
    });
  });
});
