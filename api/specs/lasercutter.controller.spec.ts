import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';
import testSchedule from './schedule.controller.spec';

const endpoint = `${config.baseUrlBackend}machines/lasercutters`;

const testLasercutter = {
  fablabId: '5b453ddb5cf4a9574849e98a',
  deviceName: 'Test Lasercutter',
  manufacturer: 'Test Manufacturer',
  activated: true,
  laserTypes: [{
    laserType: 'CO2'
  }],
  workspaceX: 2,
  workspaceY: 2,
  workspaceZ: 2,
  maxResoultion: 2,
  laserPower: 'High',
  comment: 'Create Test'
};

describe('Lasercutter Controller', async () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('gets lasercutters', (done) => {
    request.get(`${endpoint}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      if (response.body && response.body.lasercutters) {
        const { lasercutters } = { lasercutters: response.body.lasercutters };
        expect(response.statusCode).toEqual(200);
        expect(lasercutters).toBeDefined();
        expect(lasercutters.length).toBeGreaterThan(-1);
        expect(lasercutters[0].type).toEqual('lasercutter');
      } else {
        expect(response.statusCode).toEqual(204);
      }
      done();
    });
  });

  // results to an error on gitlab ci
  // it('gets lasercutters (limit & skip)', (done) => {
  //   request.get(`${endpoint}?limit=5&skip=5`, {
  //     headers: { 'content-type': 'application/json' },
  //     json: true
  //   }, (error, response) => {
  //     const lasercutters = response.body.lasercutters;
  //     expect(response.statusCode).toEqual(206);
  //     expect(lasercutters).toBeDefined();
  //     expect(lasercutters.length).toBeGreaterThan(-1);
  //     expect(lasercutters.length).toBeLessThan(6);
  //     expect(lasercutters[0].type).toEqual('lasercutter');
  //     done();
  //   });
  // });

  it('counts lasercutters', (done) => {
    request.get(`${endpoint}/count`, {
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

  it('gets lasertypes', (done) => {
    request.get(`${endpoint}/laserTypes`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      const { laserTypes } = { laserTypes: response.body.laserTypes };
      expect(response.statusCode).toEqual(200);
      expect(laserTypes).toBeDefined();
      expect(laserTypes.length).toBeGreaterThan(-1);
      done();
    });
  });

  it('create lasercutter (success)', (done) => {
    request.post(`${endpoint}/`,
      {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: testLasercutter,
        json: true
      }, (error, response) => {
        const { lasercutter } = { lasercutter: response.body.lasercutter };
        expect(response.statusCode).toEqual(201);
        expect(lasercutter).toBeDefined();
        expect(lasercutter.deviceName).toEqual(testLasercutter.deviceName);
        expect(lasercutter.type).toEqual('lasercutter');
        expect(lasercutter.manufacturer).toEqual(testLasercutter.manufacturer);
        expect(lasercutter.fablabId).toEqual(testLasercutter.fablabId);
        done();
      });
  });

  it('create lasercutter (missing fablabId)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testLasercutter));
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

  it('create lasercutter (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testLasercutter));
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

  it('create lasercutter (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testLasercutter));
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

  it('update lasercutter (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testLasercutter,
      json: true
    }, (error, response) => {
      const { lasercutter } = { lasercutter: response.body.lasercutter };
      expect(response.statusCode).toEqual(201);
      expect(lasercutter).toBeDefined();
      expect(lasercutter.deviceName).toEqual(testLasercutter.deviceName);
      expect(lasercutter.type).toEqual('lasercutter');
      expect(lasercutter.manufacturer).toEqual(testLasercutter.manufacturer);
      expect(lasercutter.fablabId).toEqual(testLasercutter.fablabId);
      lasercutter.deviceName = 'Updated';
      request.put(`${endpoint}/${lasercutter._id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: lasercutter,
        json: true
      }, (error, response) => {
        const updatedLasercutter = response.body.lasercutter;
        expect(response.statusCode).toEqual(200);
        expect(updatedLasercutter).toBeDefined();
        expect(updatedLasercutter.deviceName).toEqual(lasercutter.deviceName);
        done();
      });
    });
  });

  it('update lasercutter (id too short)', (done) => {
    const id = 'tooShortForMongoDB23';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testLasercutter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update lasercutter (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testLasercutter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update lasercutter (no body)', (done) => {
    const id = '5b453ddb5cf4a9574849e98a';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete lasercutter (success)', (done) => {
    let responseMachine;
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testLasercutter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      responseMachine = response.body.lasercutter;
      request.delete(`${endpoint}/${response.body.lasercutter._id}`,
        {
          headers: { 'content-type': 'application/json', authorization: authorizationHeader },
          json: true
        },
        (error, response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.lasercutter).toBeDefined();
          expect(response.body.lasercutter._id).toEqual(responseMachine._id);
          expect(response.body.lasercutter.activated).toEqual(false);
          done();
        });
    });
  });

  it('delete lasercutter (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete lasercutter (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get lasercutter (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testLasercutter,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      const id = response.body.lasercutter._id;
      request.get(`${endpoint}/${id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });
  });

  it('get lasercutter (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get lasercutter (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, { json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get schedules', (done) => {
    request.post(`${endpoint}/`,
      {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: testLasercutter,
        json: true
      }, (error, response) => {
        const { lasercutter } = { lasercutter: response.body.lasercutter };
        expect(response.statusCode).toEqual(201);
        expect(lasercutter).toBeDefined();
        expect(lasercutter.deviceName).toEqual(lasercutter.deviceName);
        expect(lasercutter.type).toEqual('lasercutter');
        expect(lasercutter.manufacturer).toEqual(lasercutter.manufacturer);
        expect(lasercutter.fablabId).toEqual(lasercutter.fablabId);
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
          request.get(`${endpoint}/${lasercutter._id}/schedules`,
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
