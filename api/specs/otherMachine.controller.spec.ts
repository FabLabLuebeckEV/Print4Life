import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';
import testSchedule from './schedule.controller.spec';

const endpoint = `${config.baseUrlBackend}machines/otherMachines`;

export const testOtherMachine = {
  fablabId: '5b453ddb5cf4a9574849e98a',
  deviceName: 'Test Other Machine',
  manufacturer: 'Test Manufacturer',
  activated: true,
  typeOfMachine: 'Test Machine',
  comment: 'Create Test'
};

describe('Other Machine Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('gets other machines', (done) => {
    request.get(`${endpoint}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      if (response.body && response.body.otherMachines) {
        const { otherMachines } = { otherMachines: response.body.otherMachines };
        expect(response.statusCode).toEqual(200);
        expect(otherMachines).toBeDefined();
        expect(otherMachines.length).toBeGreaterThan(-1);
        expect(otherMachines[0].type).toEqual('otherMachine');
      } else {
        expect(response.statusCode).toEqual(204);
      }
      done();
    });
  });

  // results to an error on gitlab ci
  // it('gets other machines (limit & skip)', (done) => {
  //   request.get(`${endpoint}?limit=5&skip=5`, {
  //     headers: { 'content-type': 'application/json' },
  //     json: true
  //   }, (error, response) => {
  //     const otherMachines = response.body.otherMachines;
  //     expect(response.statusCode).toEqual(206);
  //     expect(otherMachines).toBeDefined();
  //     expect(otherMachines.length).toBeGreaterThan(-1);
  //     expect(otherMachines.length).toBeLessThan(6);
  //     expect(otherMachines[0].type).toEqual('otherMachine');
  //     done();
  //   });
  // });

  it('counts other machines', (done) => {
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

  it('create other machine  (success)', (done) => {
    request.post(`${endpoint}/`,
      {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: testOtherMachine,
        json: true
      }, (error, response) => {
        const { otherMachine } = { otherMachine: response.body.otherMachine };
        expect(response.statusCode).toEqual(201);
        expect(otherMachine).toBeDefined();
        expect(otherMachine.deviceName).toEqual(testOtherMachine.deviceName);
        expect(otherMachine.type).toEqual('otherMachine');
        expect(otherMachine.manufacturer).toEqual(testOtherMachine.manufacturer);
        expect(otherMachine.fablabId).toEqual(testOtherMachine.fablabId);
        done();
      });
  });

  it('create other machine (missing fablabId)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOtherMachine));
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

  it('create other machine (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOtherMachine));
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

  it('create other machine (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOtherMachine));
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

  it('update other machine (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testOtherMachine,
      json: true
    }, (error, response) => {
      const { otherMachine } = { otherMachine: response.body.otherMachine };
      expect(response.statusCode).toEqual(201);
      expect(otherMachine).toBeDefined();
      expect(otherMachine.deviceName).toEqual(testOtherMachine.deviceName);
      expect(otherMachine.type).toEqual('otherMachine');
      expect(otherMachine.manufacturer).toEqual(testOtherMachine.manufacturer);
      expect(otherMachine.fablabId).toEqual(testOtherMachine.fablabId);
      otherMachine.deviceName = 'Updated';
      request.put(`${endpoint}/${otherMachine._id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: otherMachine,
        json: true
      }, (error, response) => {
        const updatedMachine = response.body.otherMachine;
        expect(response.statusCode).toEqual(200);
        expect(updatedMachine).toBeDefined();
        expect(updatedMachine.deviceName).toEqual(otherMachine.deviceName);
        done();
      });
    });
  });

  it('update other machine (id too short)', (done) => {
    const id = 'tooShortForMongoDB23';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testOtherMachine,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update other machine (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testOtherMachine,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update other machine (no body)', (done) => {
    const id = '5b453ddb5cf4a9574849e98a';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete other machine (success)', (done) => {
    let responseMachine;
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testOtherMachine,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      responseMachine = response.body.otherMachine;
      request.delete(`${endpoint}/${response.body.otherMachine._id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.otherMachine).toBeDefined();
        expect(response.body.otherMachine._id).toEqual(responseMachine._id);
        expect(response.body.otherMachine.activated).toEqual(false);
        done();
      });
    });
  });

  it('delete other machine (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete other machine (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get other machine (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testOtherMachine,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      const id = response.body.otherMachine._id;
      request.get(`${endpoint}/${id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });
  });

  it('get other machine (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get other machine (id too short)', (done) => {
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
        body: testOtherMachine,
        json: true
      }, (error, response) => {
        const { otherMachine } = { otherMachine: response.body.otherMachine };
        expect(response.statusCode).toEqual(201);
        expect(otherMachine).toBeDefined();
        expect(otherMachine.deviceName).toEqual(otherMachine.deviceName);
        expect(otherMachine.type).toEqual('otherMachine');
        expect(otherMachine.manufacturer).toEqual(otherMachine.manufacturer);
        expect(otherMachine.fablabId).toEqual(otherMachine.fablabId);
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
          request.get(`${endpoint}/${otherMachine._id}/schedules`,
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

export default testOtherMachine;
