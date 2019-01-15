import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { testOrder } from './order.spec';
import { getTestUserToken, newTimeout } from './global.spec';

const endpoint = `${config.baseUrlBackend}statistics`;

describe('Statistic Controller', () => {
  let originalTimeout: number;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('get statistics: ordersByDate (200)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOrder));
    request({
      uri: `${config.baseUrlBackend}orders/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      const orderResult = response.body.order;
      expect(response.statusCode).toEqual(201);
      expect(orderResult).toBeDefined();
      expect(orderResult.createdAt).toBeDefined();
      expect(orderResult.projectname).toEqual(testBody.projectname);
      expect(orderResult.editor).toEqual(testBody.editor);
      expect(orderResult.owner).toEqual(testBody.owner);
      expect(orderResult.token).toBeDefined();
      expect(orderResult.status).toEqual(testBody.status);
      request({
        uri: `${endpoint}/ordersByDate`,
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: {
          startDate: orderResult.createdAt
        }
      }, (error, response) => {
        const result = response.body.statistics;
        expect(response.statusCode).toEqual(200);
        expect(result).toBeDefined();
        expect(result.fablabs).toBeDefined();
        expect(result.fablabs.length).toBeGreaterThan(0);
        expect(result.machines).toBeDefined();
        expect(result.machines[orderResult.machine.type]).toBeDefined();
        expect(result.machines[orderResult.machine.type].length).toBeGreaterThan(0);
        const orderMachine = result.machines[orderResult.machine.type].filter(
          (machine: any) => machine.id === orderResult.machine._id
        );
        expect(orderMachine).toBeDefined();
        expect(orderMachine[0]).toBeDefined();
        expect(orderMachine[0].orders).toBeDefined();
        expect(orderMachine[0].orders[orderResult.status]).toBeDefined();
        expect(orderMachine[0].orders[orderResult.status].length).toBeGreaterThan(0);
        expect(orderMachine[0].orders[orderResult.status].filter(
          (order: any) => orderResult._id === order._id
        ).length).toBeGreaterThan(0);
        done();
      });
    });
  });

  it('get statistics: ordersByDate (204)', (done) => {
    request({
      uri: `${endpoint}/ordersByDate`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: {
        startDate: '2200-12-30'
      }
    }, (error, response) => {
      expect(response.statusCode).toEqual(204);
      expect(response.body).toBeUndefined();
      done();
    });
  });

  it('get statistics: ordersByDate (400)', (done) => {
    request({
      uri: `${endpoint}/ordersByDate`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: {
      }
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
