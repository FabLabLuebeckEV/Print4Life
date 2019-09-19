import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';
import { ErrorType } from '../services/router.service';
import logger from '../logger';

const endpoint = config.baseUrlBackend;

export const testIoTDevice = {
  deviceType: 'Sensor',
  deviceId: 'IoTDevice-Test-',
  events: [
    { topic: 'Event_1', dataformat: 'json' },
    { topic: 'Event_2', dataformat: 'json' }
  ]
};

xdescribe('IoT Device Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('gets iot devices', (done) => {
    request.get(`${endpoint}iot-devices/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    },
    (error, response) => {
      if (response.body && response.body) {
        const { iotDevices } = { iotDevices: response.body['iot-devices'] };
        expect(response.statusCode).toEqual(200);
        expect(iotDevices).toBeDefined();
        expect(iotDevices.length).toBeGreaterThan(-1);
      } else {
        expect(response.statusCode).toEqual(204);
      }
      done();
    });
  });

  it('counts iot devices', (done) => {
    request.post(`${endpoint}iot-devices/count`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: { query: { $and: [{ $text: { $search: 'IoTDevice' } }] } }
    }, (error, response) => {
      const { count } = { count: response.body.count };
      expect(response.statusCode).toEqual(200);
      expect(count).toBeDefined();
      expect(count).toBeGreaterThan(-1);
      done();
    });
  });

  it('search iot devices', (done) => {
    const testBody = JSON.parse(JSON.stringify(testIoTDevice));
    let id = '';
    testBody.deviceId += (Math.random() * 1000 + 1).toString().replace('.', '-');
    request({
      uri: `${endpoint}iot-devices/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      const { iotDevice } = { iotDevice: response.body['iot-device'] };
      expect(iotDevice).toBeDefined();
      expect(iotDevice._id).toBeDefined();
      id = iotDevice._id;
      request.post(`${endpoint}iot-devices/search`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: { query: { $and: [{ $text: { $search: 'IoTDevice' } }] } }
      }, (error, response) => {
        logger.info(`search device response: ${JSON.stringify(error)}, ${JSON.stringify(response)}`);
        const { iotDevices } = { iotDevices: response.body['iot-devices'] };
        expect(response.statusCode).toEqual(200);
        expect(iotDevices).toBeDefined();
        expect(iotDevices.length).toBeGreaterThan(-1);
        if (iotDevices.length > 0) {
          expect(iotDevices[0].deviceId).toContain('IoTDevice');
        }
        deleteDevice(testBody, id, authorizationHeader, done);
      });
    });
  });

  it('create iot device (deviceId missing)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testIoTDevice));
    delete testBody.deviceId;
    request.post(`${endpoint}/iot-devices/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testBody,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      expect(response.body.type).toBeDefined();
      expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
      done();
    });
  });

  it('create iot device (deviceType missing)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testIoTDevice));
    delete testBody.deviceType;
    request.post(`${endpoint}/iot-devices/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testBody,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      expect(response.body.type).toBeDefined();
      expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
      done();
    });
  });

  it('create and delete iot device', (done) => {
    const testBody = JSON.parse(JSON.stringify(testIoTDevice));
    testBody.deviceId += (Math.random() * 1000 + 1).toString().replace('.', '-');
    request({
      uri: `${endpoint}iot-devices/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      const iotDeviceResult = response.body['iot-device'];
      expect(response.statusCode).toEqual(201);
      expect(iotDeviceResult).toBeDefined();
      expect(iotDeviceResult.deviceId).toEqual(testBody.deviceId);
      expect(iotDeviceResult.deviceType).toEqual(testIoTDevice.deviceType);
      expect(iotDeviceResult.events).toBeDefined();
      expect(iotDeviceResult.events.length).toEqual(testIoTDevice.events.length);
      iotDeviceResult.events.forEach((event, idx) => {
        expect(event.topic).toEqual(testIoTDevice.events[idx].topic);
        expect(event.dataformat).toEqual(testIoTDevice.events[idx].dataformat);
      });
      deleteDevice(testBody, iotDeviceResult._id, authorizationHeader, done);
    });
  });

  it('get iot device by id (invalid id)', (done) => {
    request({
      uri: `${endpoint}iot-devices/123456789123456789asdfgh`,
      method: 'GET',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      expect(response.body.type).toBeDefined();
      expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
      done();
    });
  });

  it('get iot device by id (wrong id)', (done) => {
    request({
      uri: `${endpoint}iot-devices/5c4b5318b9b20c5fb04ae084`,
      method: 'GET',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(404);
      expect(response.body.type).toBeDefined();
      expect(response.body.type).toEqual(ErrorType.INVALID_ID);
      done();
    });
  });

  it('get iot device by id', (done) => {
    const testBody = JSON.parse(JSON.stringify(testIoTDevice));
    testBody.deviceId += (Math.random() * 1000 + 1).toString().replace('.', '-');
    request({
      uri: `${endpoint}iot-devices/`,
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: testBody
    }, (error, response) => {
      logger.info(`request response: ${JSON.stringify(error)}, ${JSON.stringify(response)}`);
      testBody.id = response.body['iot-device']._id;
      request({
        uri: `${endpoint}iot-devices/${response.body['iot-device']._id}`,
        method: 'GET',
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        const iotDeviceResult = response.body['iot-device'];
        expect(response.statusCode).toEqual(200);
        expect(iotDeviceResult).toBeDefined();
        expect(iotDeviceResult.deviceId).toEqual(testBody.deviceId);
        expect(iotDeviceResult.deviceType).toEqual(testIoTDevice.deviceType);
        expect(iotDeviceResult.events).toBeDefined();
        expect(iotDeviceResult.events.length).toEqual(testIoTDevice.events.length);
        iotDeviceResult.events.forEach((event, idx) => {
          expect(event.topic).toEqual(testIoTDevice.events[idx].topic);
          expect(event.dataformat).toEqual(testIoTDevice.events[idx].dataformat);
        });
        deleteDevice(testBody, testBody.id, authorizationHeader, done);
      });
    });
  });
  it('delete iot device by id (invalid id)', (done) => {
    request({
      uri: `${endpoint}iot-devices/123456789123456789asdfgh`,
      method: 'DELETE',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      expect(response.body.type).toBeDefined();
      expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
      done();
    });
  });

  it('delete iot device by id (wrong id)', (done) => {
    request({
      uri: `${endpoint}iot-devices/5c4b5318b9b20c5fb04ae084`,
      method: 'DELETE',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(404);
      expect(response.body.type).toBeDefined();
      expect(response.body.type).toEqual(ErrorType.INVALID_ID);
      done();
    });
  });
});

function deleteDevice (testBody: { deviceId: string }, id: string, authorizationHeader: any, done: Function) {
  request({
    uri: `${endpoint}iot-devices/${id}`,
    method: 'DELETE',
    headers: { 'content-type': 'application/json', authorization: authorizationHeader },
    json: true,
    body: testBody
  }, (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(response.body['iot-device'].deviceId).toEqual(testBody.deviceId);
    done();
  });
}

export default testIoTDevice;
