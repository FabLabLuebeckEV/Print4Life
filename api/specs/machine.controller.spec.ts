import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';

const endpoint = config.baseUrlBackend;


describe('Machine Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('gets all machines', (done) => {
    request.get(`${endpoint}machines/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      const { machines } = { machines: response.body.machines };
      expect(response.statusCode).toEqual(200);
      expect(machines).toBeDefined();
      expect(Object.keys(machines).length).toBeGreaterThan(0);
      Object.keys(machines).forEach((machineType) => {
        expect(machines[machineType]).toBeDefined();
        expect(machines[machineType].length).toBeGreaterThan(-1);
      });
      done();
    });
  });

  it('gets all machine types', (done) => {
    request.get(`${endpoint}machines/types`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      const { types } = { types: response.body.types };
      expect(response.statusCode).toEqual(200);
      expect(types).toBeDefined();
      expect(Object.keys(types).length).toBeGreaterThan(0);
      done();
    });
  });
});
