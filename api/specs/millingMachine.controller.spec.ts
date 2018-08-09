import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = `${configs.configArr.prod.baseUrlBackend}machines/millingMachines`;

const testMillingMachine = {
  fablabId: '5b453ddb5cf4a9574849e98a',
  deviceName: 'Test Milling Machine',
  manufacturer: 'Test Manufacturer',
  laserTypes: [{
    laserType: 'CO2'
  }],
  workspaceX: 2,
  workspaceY: 2,
  workspaceZ: 2,
  maxResoultion: 2,
  laserPower: 'High',
  pictureURL: '',
  comment: 'Create Test'
};

describe('Milling Machine Controller', () => {
  it('gets milling machines', (done) => {
    request.get(`${endpoint}`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const millingMachines = response.body.millingMachines;
      expect(response.statusCode).toEqual(200);
      expect(millingMachines).toBeDefined();
      expect(millingMachines.length).toBeGreaterThan(-1);
      expect(millingMachines[0].type).toEqual('millingMachine');
      done();
    });
  });

  it('gets milling machines', (done) => {
    request.get(`${endpoint}?limit=5&skip=5`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const millingMachines = response.body.millingMachines;
      expect(response.statusCode).toEqual(200);
      expect(millingMachines).toBeDefined();
      expect(millingMachines.length).toBeGreaterThan(-1);
      expect(millingMachines.length).toBeLessThan(6);
      expect(millingMachines[0].type).toEqual('millingMachine');
      done();
    });
  });

  it('counts milling machines', (done) => {
    request.get(`${endpoint}/count`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const count = response.body.count;
      expect(response.statusCode).toEqual(200);
      expect(count).toBeDefined();
      expect(count).toBeGreaterThan(-1);
      done();
    });
  });

  it('create milling machine  (success)', (done) => {
    request.post(`${endpoint}/`,
      { body: testMillingMachine, json: true }, (error, response) => {
        const millingMachine = response.body.millingMachine;
        expect(response.statusCode).toEqual(201);
        expect(millingMachine).toBeDefined();
        expect(millingMachine.deviceName).toEqual(testMillingMachine.deviceName);
        expect(millingMachine.type).toEqual('millingMachine');
        expect(millingMachine.manufacturer).toEqual(testMillingMachine.manufacturer);
        expect(millingMachine.fablabId).toEqual(testMillingMachine.fablabId);
        done();
      });
  });

  it('create milling machine  (missing fablabId)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testMillingMachine));
    delete testBody.fablabId;
    request.post(`${endpoint}/`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create milling machine  (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testMillingMachine));
    testBody.fablabId = 'tooShortForMongoDB23';
    request.post(`${endpoint}/`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create milling machine (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testMillingMachine));
    testBody.fablabId = 'tooLongForMongoDBsObjectId1234567890';
    request.post(`${endpoint}/`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update milling machine (success)', (done) => {
    request.post(`${endpoint}/`, { body: testMillingMachine, json: true }, (error, response) => {
      const millingMachine = response.body.millingMachine;
      expect(response.statusCode).toEqual(201);
      expect(millingMachine).toBeDefined();
      expect(millingMachine.deviceName).toEqual(testMillingMachine.deviceName);
      expect(millingMachine.type).toEqual('millingMachine');
      expect(millingMachine.manufacturer).toEqual(testMillingMachine.manufacturer);
      expect(millingMachine.fablabId).toEqual(testMillingMachine.fablabId);
      millingMachine.deviceName = 'Updated';
      request.put(`${endpoint}/${millingMachine._id}`, { body: millingMachine, json: true }, (error, response) => {
        const updatedMachine = response.body.millingMachine;
        expect(response.statusCode).toEqual(200);
        expect(updatedMachine).toBeDefined();
        expect(updatedMachine.deviceName).toEqual(millingMachine.deviceName);
        done();
      });
    });
  });

  it('update milling machine (id too short)', (done) => {
    const id = 'tooShortForMongoDB23';
    request.put(`${endpoint}/${id}`, { body: testMillingMachine, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update milling machine (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.put(`${endpoint}/${id}`, { body: testMillingMachine, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update milling machine (no body)', (done) => {
    const id = '5b453ddb5cf4a9574849e98a';
    request.put(`${endpoint}/${id}`, { json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete milling machine (success)', (done) => {
    let responseMachine;
    request.post(`${endpoint}/`, { body: testMillingMachine, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      responseMachine = response.body.millingMachine;
      request.delete(`${endpoint}/${response.body.millingMachine._id}`, {
        headers: { 'content-type': 'application/json' },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.millingMachine).toBeDefined();
        expect(response.body.millingMachine._id).toEqual(responseMachine._id);
        request.get(`${endpoint}/${responseMachine._id}`, {
          headers: { 'content-type': 'application/json' },
          json: true
        }, (error, response) => {
          expect(response.statusCode).toEqual(404);
          expect(response.body.millingMachine).toBeUndefined();
          done();
        });
      });
    });
  });

  it('delete milling machine (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete milling machine (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get milling machine (success)', (done) => {
    request.post(`${endpoint}/`, { body: testMillingMachine, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      const id = response.body.millingMachine._id;
      request.get(`${endpoint}/${id}`, {
        headers: { 'content-type': 'application/json' },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });
  });

  it('get milling machine (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get milling machine (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
