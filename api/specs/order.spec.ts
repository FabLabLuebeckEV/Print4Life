import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';


const endpoint = config.baseUrlBackend;
const testOrder = {
  projectname: 'unscheinBar',
  comments: [],
  editor: '12345678901234567890aaaa',
  owner: '12345678901234567890aaaa',
  files: [],
  status: 'new',
  machine: {
    type: 'otherMachine',
    _id: '12345678901234567890aaaa',
  }
};

describe('Order Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('gets orders', (done) => {
    request.get(`${endpoint}orders/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    },
    (error, response) => {
      if (response.body && response.body.orders) {
        const { orders } = { orders: response.body.orders };
        expect(response.statusCode).toEqual(200);
        expect(orders).toBeDefined();
        expect(orders.length).toBeGreaterThan(-1);
      } else {
        expect(response.statusCode).toEqual(204);
      }
      done();
    });
  });

  // it('gets orders (limit & skip)', (done) => {
  //   request.get(`${endpoint}orders/?limit=5&skip=5`, { headers: { 'content-type': 'application/json' } },
  //     (error, response) => {
  //       const orders = JSON.parse(response.body).orders;
  //       expect(response.statusCode).toEqual(206);
  //       expect(orders).toBeDefined();
  //       expect(orders.length).toBeGreaterThan(-1);
  //       expect(orders.length).toBeLessThan(6);
  //       done();
  //     });
  // });

  it('counts orders', (done) => {
    request.post(`${endpoint}orders/count`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: { query: { $or: [{ status: 'new' }, { status: 'deleted' }] } }
    }, (error, response) => {
      const { count } = { count: response.body.count };
      expect(response.statusCode).toEqual(200);
      expect(count).toBeDefined();
      expect(count).toBeGreaterThan(-1);
      done();
    });
  });

  it('create order', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOrder));
    request({
      uri: `${endpoint}orders/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      const orderResult = response.body.order;

      expect(response.statusCode).toEqual(201);
      expect(orderResult).toBeDefined();
      expect(orderResult.projectname).toEqual(testBody.projectname);
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
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'GET',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
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
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      response.body.order.owner = 'aaa123456789012345678902';
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'PUT',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: response.body.order
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.order).toBeDefined();

        expect(response.body.order.owner).toEqual('aaa123456789012345678902');

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
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'DELETE',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
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
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
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

  it('gets outstanding status', (done) => {
    request({
      uri: `${endpoint}orders/status/outstanding`,
      method: 'GET',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toBeDefined();
      expect(response.body.status).toEqual('representive');
      done();
    });
  });
});
