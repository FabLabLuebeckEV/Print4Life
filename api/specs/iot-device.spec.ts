import 'jasmine';
import * as request from 'request';
import * as uuid from 'uuid/v4';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';

const endpoint = config.baseUrlBackend;

export const testIoTDevice = {
  deviceType: 'Sensor',
  deviceId: 'Sensor-Test-',
  events: [
    { topic: 'Event_1', dataformat: 'json' },
    { topic: 'Event_2', dataformat: 'json' }
  ]
};

describe('IoT Device Controller', () => {
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
      body: { query: { $and: [{ $text: { $search: 'Sensor' } }] } }
    }, (error, response) => {
      const { count } = { count: response.body.count };
      expect(response.statusCode).toEqual(200);
      expect(count).toBeDefined();
      expect(count).toBeGreaterThan(-1);
      done();
    });
  });

  it('search iot devices', (done) => {
    request.post(`${endpoint}iot-devices/search`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: { query: { $and: [{ $text: { $search: 'Sensor' } }] } }
    }, (error, response) => {
      const { iotDevices } = { iotDevices: response.body['iot-devices'] };
      expect(response.statusCode).toEqual(200);
      expect(iotDevices).toBeDefined();
      expect(iotDevices.length).toBeGreaterThan(-1);
      if (iotDevices.length > 0) {
        expect(iotDevices[0].deviceId).toContain('Sensor');
      }
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
});

function deleteDevice (testBody, id, authorizationHeader, done) {
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
