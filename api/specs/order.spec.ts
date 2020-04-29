import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import {
  getTestUserToken, getTestUserNormalToken, newTimeout, // , testUserNormal, testUserEditor
  getTestUserNormalToken2, testUserNormal
} from './global.spec';

const endpoint = config.baseUrlBackend;
export const testOrder = {
  projectname: 'unscheinBar',
  comments: [],
  editor: '5bc9849df2a4ed082b73a6f9',
  owner: testUserNormal.id,
  fablabId: '5b453ddb5cf4a9574849e98a',
  files: [],
  status: 'new',
  shippingAddress: {
    street: 'Example Street',
    zipCode: 'D15623',
    city: 'Example City',
    country: 'Dreamland'
  },
  machine: {
    type: 'otherMachine',
    _id: '5b55f7bf3fe0c8b01713b3ef',
  }
};

describe('Order Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  const authorizationHeaderNormal = getTestUserNormalToken();
  const authorizationHeaderNormal2 = getTestUserNormalToken2();
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
        expect(response.body.order.shippingAddress).toEqual(testBody.shippingAddress);
        done();
      });
    });
  });

  it('should not get the order shipping address when not logged in', (done) => {
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
        headers: { 'content-type': 'application/json' },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        // see #161
        expect(response.body.order.shippingAddress).toBeUndefined();

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
      response.body.order.projectname = 'updated';
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'PUT',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: response.body.order
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.order).toBeDefined();

        expect(response.body.order.projectname).toEqual('updated');

        expect(response.body.order.token).toBeDefined();
        expect(response.body.order.editor).toEqual(testBody.editor);
        expect(response.body.order.status).toEqual(testBody.status);
        done();
      });
    });
  });


  it('should not update the order if the user is not admin, editor or owner', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOrder));

    request({
      uri: `${endpoint}orders/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeaderNormal },
      json: true,
      body: testBody
    }, (error, response) => {
      response.body.order.projectname = 'updated';
      request({
        uri: `${endpoint}orders/${response.body.order._id}`,
        method: 'PUT',
        headers: { 'content-type': 'application/json', authorization: authorizationHeaderNormal2 },
        json: true,
        body: response.body.order
      }, (error, response2) => {
        expect(response2.statusCode).toEqual(403);
        request({
          uri: `${endpoint}orders/${response.body.order._id}`,
          method: 'GET',
          headers: { 'content-type': 'application/json', authorization: authorizationHeader },
          json: true
        }, (error, response3) => {
          expect(response3.statusCode).toEqual(200);
          expect(response3.body.order).toBeDefined();
          expect(response3.body.order.projectname).toEqual(testBody.projectname);

          request({
            uri: `${endpoint}orders/${response.body.order._id}`,
            method: 'PUT',
            headers: { 'content-type': 'application/json', authorization: authorizationHeaderNormal },
            json: true,
            body: response.body.order
          }, (error, response4) => {
            expect(response4.statusCode).toEqual(200);
            expect(response4.body.order).toBeDefined();

            expect(response4.body.order.projectname).toEqual('updated');

            expect(response4.body.order.token).toBeDefined();
            expect(response4.body.order.editor).toEqual(testBody.editor);
            expect(response4.body.order.status).toEqual(testBody.status);
            done();
          });
        });
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

  it('should not delete order if the user is no editor or admin', (done) => {
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
        headers: { 'content-type': 'application/json', authorization: authorizationHeaderNormal },
        json: true
      }, (error, response2) => {
        expect(response2.statusCode).toEqual(403);

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

export default testOrder;
