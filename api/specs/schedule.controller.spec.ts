import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';
import { testOrder } from './order.spec';
import { testOtherMachine } from './otherMachine.controller.spec';
import logger from '../logger';


const endpoint = config.baseUrlBackend;
const testSchedule = {
  startDate: new Date(),
  endDate: new Date(),
  machine: {
    type: '',
    id: ''
  },
  fablabId: '',
  orderId: ''
};

function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

describe('Schedule Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();

  const testOrderBody = JSON.parse(JSON.stringify(testOrder));
  request.post(`${endpoint}/machines/otherMachines`,
    {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testOtherMachine,
      json: true
    }, (err, response) => {
      if (err) {
        logger.error({ err, stack: err.stack });
      } else {
        testSchedule.machine.type = response.body.otherMachine.type;
        testSchedule.machine.id = response.body.otherMachine._id;
        testSchedule.fablabId = response.body.otherMachine.fablabId;
        testOrderBody.machine.type = response.body.otherMachine.type;
        testOrderBody.machine._id = response.body.otherMachine._id;
        request({
          uri: `${endpoint}orders/`,
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: authorizationHeader },
          json: true,
          body: testOrderBody
        }, (err, response) => {
          if (err) {
            logger.error({ err, stack: err.stack });
          } else {
            testSchedule.orderId = response.body.order._id;
          }
        });
      }
    });

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('gets schedules', (done) => {
    request.get(`${endpoint}schedules/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    },
    (error, response) => {
      if (response.body && response.body.schedules) {
        const { schedules } = { schedules: response.body.schedules };
        expect(response.statusCode).toEqual(200);
        expect(schedules).toBeDefined();
        expect(schedules.length).toBeGreaterThan(-1);
      } else {
        expect(response.statusCode).toEqual(204);
      }
      done();
    });
  });

  it('create schedule', (done) => {
    const testBody = JSON.parse(JSON.stringify(testSchedule));
    const today = new Date();
    const startDate = randomDate(new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 0, 20));
    testBody.startDate = startDate;
    testBody.endDate = startDate;
    testBody.endDate.setMinutes(startDate.getMinutes() + 1);
    request({
      uri: `${endpoint}schedules/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      const scheduleResult = response.body.schedule;

      expect(response.statusCode).toEqual(201);
      expect(scheduleResult).toBeDefined();
      expect(new Date(scheduleResult.startDate)).toEqual(testBody.startDate);
      expect(new Date(scheduleResult.endDate)).toEqual(testBody.endDate);
      expect(scheduleResult.orderId).toEqual(testBody.orderId);
      expect(scheduleResult.fablabId).toEqual(testBody.fablabId);
      expect(scheduleResult.machine).toBeDefined();
      expect(scheduleResult.machine.type).toEqual(testBody.machine.type);
      expect(scheduleResult.machine.id).toEqual(testBody.machine.id);
      done();
    });
  });

  it('get schedule by id', (done) => {
    const testBody = JSON.parse(JSON.stringify(testSchedule));
    const today = new Date();
    const startDate = randomDate(new Date(today.getFullYear(), 1, 1), new Date(today.getFullYear(), 1, 20));
    testBody.startDate = startDate;
    testBody.endDate = startDate;
    testBody.endDate.setMinutes(startDate.getMinutes() + 1);
    request({
      uri: `${endpoint}schedules/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}schedules/${response.body.schedule._id}`,
        method: 'GET',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        const scheduleResult = response.body.schedule;
        expect(response.body.schedule).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(new Date(scheduleResult.startDate)).toEqual(testBody.startDate);
        expect(new Date(scheduleResult.endDate)).toEqual(testBody.endDate);
        expect(scheduleResult.orderId).toEqual(testBody.orderId);
        expect(scheduleResult.fablabId).toEqual(testBody.fablabId);
        expect(scheduleResult.machine).toBeDefined();
        expect(scheduleResult.machine.type).toEqual(testBody.machine.type);
        expect(scheduleResult.machine.id).toEqual(testBody.machine.id);
        done();
      });
    });
  });

  it('update schedule', (done) => {
    const testBody = JSON.parse(JSON.stringify(testSchedule));
    const today = new Date();
    const startDate = randomDate(new Date(today.getFullYear(), 2, 1), new Date(today.getFullYear(), 2, 20));
    testBody.startDate = startDate;
    testBody.endDate = startDate;
    testBody.endDate.setMinutes(startDate.getMinutes() + 1);
    request({
      uri: `${endpoint}schedules/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      testBody.startDate = new Date();
      testBody.endDate = new Date();
      response.body.schedule.startDate = testBody.startDate;
      response.body.schedule.endDate = testBody.endDate;
      request({
        uri: `${endpoint}schedules/${response.body.schedule._id}`,
        method: 'PUT',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: response.body.schedule
      }, (error, response) => {
        const scheduleResult = response.body.schedule;
        expect(response.statusCode).toEqual(200);
        expect(response.body.schedule).toBeDefined();
        expect(new Date(scheduleResult.startDate)).toEqual(testBody.startDate);
        expect(new Date(scheduleResult.endDate)).toEqual(testBody.endDate);
        expect(scheduleResult.orderId).toEqual(testBody.orderId);
        expect(scheduleResult.fablabId).toEqual(testBody.fablabId);
        expect(scheduleResult.machine).toBeDefined();
        expect(scheduleResult.machine.type).toEqual(testBody.machine.type);
        expect(scheduleResult.machine.id).toEqual(testBody.machine.id);
        done();
      });
    });
  });

  it('delete schedule', (done) => {
    const testBody = JSON.parse(JSON.stringify(testSchedule));
    const today = new Date();
    const startDate = randomDate(new Date(today.getFullYear(), 3, 1), new Date(today.getFullYear(), 3, 20));
    testBody.startDate = startDate;
    testBody.endDate = startDate;
    testBody.endDate.setMinutes(startDate.getMinutes() + 1);
    request({
      uri: `${endpoint}schedules/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      request({
        uri: `${endpoint}schedules/${response.body.schedule._id}`,
        method: 'DELETE',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        const scheduleResult = response.body.schedule;
        expect(response.body.schedule).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(new Date(scheduleResult.startDate)).toEqual(testBody.startDate);
        expect(new Date(scheduleResult.endDate)).toEqual(testBody.endDate);
        expect(scheduleResult.orderId).toEqual(testBody.orderId);
        expect(scheduleResult.fablabId).toEqual(testBody.fablabId);
        expect(scheduleResult.machine).toBeDefined();
        expect(scheduleResult.machine.type).toEqual(testBody.machine.type);
        expect(scheduleResult.machine.id).toEqual(testBody.machine.id);
        done();
      });
    });
  });
});
