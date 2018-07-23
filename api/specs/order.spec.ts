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

describe('Order Controller', () => {
  it('create order', (done) => {
    request({
      uri: `${endpoint}orders/placeOrder`,
      method: 'POST',
      json: true,
      body: testOrder
    }, (error, response) => {
      const orders = JSON.parse(response.body).orders;
      logger.log(JSON.stringify(orders, null, 2));
      expect(response.statusCode).toEqual(200);
      expect(orders).toBeDefined();
      expect(orders.length).toBeGreaterThan(-1);
      done();
    });
  });
});
