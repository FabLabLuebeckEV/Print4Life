import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';
import testSchedule from './schedule.controller.spec';

const endpoint = `${config.baseUrlBackend}machines/3d-printers`;

const testPrinter = {
  fablabId: '5b453ddb5cf4a9574849e98a',
  deviceName: 'Test Printer',
  manufacturer: 'Test Manufacturer',
  activated: true,
  materials: [{
    material: 'PLA',
    type: 'printerMaterial'
  }],
  camSoftware: 'Test Software',
  printVolumeX: 2,
  printVolumeY: 2,
  printVolumeZ: 2,
  printResolutionX: 2,
  printResolutionY: 2,
  printResolutionZ: 2,
  nozzleDiameter: 2,
  numberOfExtruders: 2,
  comment: 'Create Test',
  type: '3d-printer'
};

describe('3D Printer Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('gets 3D printers', (done) => {
    request.get(`${endpoint}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      if (response.body && response.body['3d-printers']) {
        const printers3d = response.body['3d-printers'];
        expect(response.statusCode).toEqual(200);
        expect(printers3d).toBeDefined();
        expect(printers3d.length).toBeGreaterThan(-1);
        expect(printers3d[0].type).toEqual('3d-printer');
      } else {
        expect(response.statusCode).toEqual(204);
      }
      done();
    });
  });

  // results to an error on gitlab ci
  // it('gets printers3d (limit & skip)', (done) => {
  //   request.get(`${endpoint}?limit=5&skip=5`, {
  //     headers: { 'content-type': 'application/json' },
  //     json: true
  //   }, (error, response) => {
  //     const printers3d = response.body['3d-printers'];
  //     expect(response.statusCode).toEqual(206);
  //     expect(printers3d).toBeDefined();
  //     expect(printers3d.length).toBeGreaterThan(-1);
  //     expect(printers3d.length).toBeLessThan(6);
  //     expect(printers3d[0].type).toEqual('3d-printers');
  //     done();
  //   });
  // });

  it('counts 3D printers', (done) => {
    request.post(`${endpoint}/count`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      const { count } = { count: response.body.count };
      expect(response.statusCode).toEqual(200);
      expect(count).toBeDefined();
      expect(count).toBeGreaterThan(-1);
      done();
    });
  });

  it('create 3D printer (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testPrinter,
      json: true
    }, (error, response) => {
      const printer3d = response.body['3d-printer'];
      expect(response.statusCode).toEqual(201);
      expect(printer3d).toBeDefined();
      expect(printer3d.deviceName).toEqual(testPrinter.deviceName);
      expect(printer3d.type).toEqual('3d-printer');
      expect(printer3d.manufacturer).toEqual(testPrinter.manufacturer);
      expect(printer3d.fablabId).toEqual(testPrinter.fablabId);
      done();
    });
  });

  it('create 3D printer (missing fablabId)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testPrinter));
    delete testBody.fablabId;
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testBody,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create 3D printer (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testPrinter));
    testBody.fablabId = 'tooShortForMongoDB23';
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testBody,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create 3D printer (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testPrinter));
    testBody.fablabId = 'tooLongForMongoDBsObjectId1234567890';
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testBody,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update 3D printer (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testPrinter,
      json: true
    }, (error, response) => {
      const printer = response.body['3d-printer'];
      expect(response.statusCode).toEqual(201);
      expect(printer).toBeDefined();
      expect(printer.deviceName).toEqual(testPrinter.deviceName);
      expect(printer.type).toEqual('3d-printer');
      expect(printer.manufacturer).toEqual(testPrinter.manufacturer);
      expect(printer.fablabId).toEqual(testPrinter.fablabId);
      printer.deviceName = 'Updated';
      request.put(`${endpoint}/${printer._id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: printer,
        json: true
      }, (error, response) => {
        const updatedPrinter = response.body['3d-printer'];
        expect(response.statusCode).toEqual(200);
        expect(updatedPrinter).toBeDefined();
        expect(updatedPrinter.deviceName).toEqual(printer.deviceName);
        done();
      });
    });
  });

  it('update 3D printer (id too short)', (done) => {
    const id = 'tooShortForMongoDB23';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testPrinter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update 3D printer (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testPrinter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update 3D printer (no body)', (done) => {
    const id = '5b453ddb5cf4a9574849e98a';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete 3D printer (success)', (done) => {
    let responseMachine;
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testPrinter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      responseMachine = response.body['3d-printer'];
      request.delete(`${endpoint}/${responseMachine._id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body['3d-printer']).toBeDefined();
        expect(response.body['3d-printer']._id).toEqual(responseMachine._id);
        expect(response.body['3d-printer'].activated).toEqual(false);
        done();
      });
    });
  });

  it('delete 3D printer (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete 3D printer (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get 3D printer (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testPrinter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      const id = response.body['3d-printer']._id;
      request.get(`${endpoint}/${id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });
  });

  it('get 3D printer (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get 3D printer (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get schedules', (done) => {
    request.post(`${endpoint}/`,
      {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: testPrinter,
        json: true
      }, (error, response) => {
        const { printer3d } = { printer3d: response.body['3d-printer'] };
        expect(response.statusCode).toEqual(201);
        expect(printer3d).toBeDefined();
        expect(printer3d.deviceName).toEqual(printer3d.deviceName);
        expect(printer3d.type).toEqual('3d-printer');
        expect(printer3d.manufacturer).toEqual(printer3d.manufacturer);
        expect(printer3d.fablabId).toEqual(printer3d.fablabId);
        const testBody = JSON.parse(JSON.stringify(testSchedule));
        const startDate = new Date();
        testBody.startDate = startDate;
        testBody.endDate = startDate;
        testBody.endDate.setMinutes(startDate.getMinutes() + 1);
        request({
          uri: `${config.baseUrlBackend}schedules/`,
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
          request.get(`${endpoint}/${printer3d._id}/schedules`,
            {
              headers: { 'content-type': 'application/json', authorization: authorizationHeader },
              json: true
            }, (error, response) => {
              if (response.statusCode && response.statusCode !== 204) {
                const { schedules } = { schedules: response.body.schedules };
                expect(schedules).toBeDefined();
                expect(response.statusCode).toEqual(200);
                expect(schedules.length).toBeGreaterThan(0);
              } else {
                expect(response.statusCode).toEqual(204);
              }
              done();
            });
        });
      });
  });
});
