import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = `${configs.configArr.prod.baseUrlBackend}machines/lasercutters`;

const testLasercutter = {
  fablabId: '5b453ddb5cf4a9574849e98a',
  deviceName: 'Test Lasercutter',
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

describe('Lasercutter Controller', () => {
  it('gets lasercutters', (done) => {
    request.get(`${endpoint}`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const lasercutters = response.body.lasercutters;
      expect(response.statusCode).toEqual(200);
      expect(lasercutters).toBeDefined();
      expect(lasercutters.length).toBeGreaterThan(-1);
      expect(lasercutters[0].type).toEqual('lasercutter');
      done();
    });
  });

  it('gets lasercutters (limit & skip)', (done) => {
    request.get(`${endpoint}?limit=5&skip=5`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const lasercutters = response.body.lasercutters;
      expect(response.statusCode).toEqual(200);
      expect(lasercutters).toBeDefined();
      expect(lasercutters.length).toBeGreaterThan(-1);
      expect(lasercutters.length).toBeLessThan(6);
      expect(lasercutters[0].type).toEqual('lasercutter');
      done();
    });
  });

  it('counts lasercutters', (done) => {
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

  it('gets lasertypes', (done) => {
    request.get(`${endpoint}/laserTypes`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const laserTypes = response.body.laserTypes;
      expect(response.statusCode).toEqual(200);
      expect(laserTypes).toBeDefined();
      expect(laserTypes.length).toBeGreaterThan(-1);
      done();
    });
  });

  it('create lasercutter (success)', (done) => {
    request.post(`${endpoint}/`,
      { body: testLasercutter, json: true }, (error, response) => {
        const lasercutter = response.body.lasercutter;
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
    request.post(`${endpoint}/`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create lasercutter (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testLasercutter));
    testBody.fablabId = 'tooShortForMongoDB23';
    request.post(`${endpoint}/`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create lasercutter (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testLasercutter));
    testBody.fablabId = 'tooLongForMongoDBsObjectId1234567890';
    request.post(`${endpoint}/`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update lasercutter (success)', (done) => {
    request.post(`${endpoint}/`, { body: testLasercutter, json: true }, (error, response) => {
      const lasercutter = response.body.lasercutter;
      expect(response.statusCode).toEqual(201);
      expect(lasercutter).toBeDefined();
      expect(lasercutter.deviceName).toEqual(testLasercutter.deviceName);
      expect(lasercutter.type).toEqual('lasercutter');
      expect(lasercutter.manufacturer).toEqual(testLasercutter.manufacturer);
      expect(lasercutter.fablabId).toEqual(testLasercutter.fablabId);
      lasercutter.deviceName = 'Updated';
      request.put(`${endpoint}/${lasercutter._id}`, { body: lasercutter, json: true }, (error, response) => {
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
    request.put(`${endpoint}/${id}`, { body: testLasercutter, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update lasercutter (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.put(`${endpoint}/${id}`, { body: testLasercutter, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update lasercutter (no body)', (done) => {
    const id = '5b453ddb5cf4a9574849e98a';
    request.put(`${endpoint}/${id}`, { json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete lasercutter (success)', (done) => {
    let responseMachine;
    request.post(`${endpoint}/`, { body: testLasercutter, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      responseMachine = response.body.lasercutter;
      request.delete(`${endpoint}/${response.body.lasercutter._id}`,
        { headers: { 'content-type': 'application/json' }, json: true },
        (error, response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body.lasercutter).toBeDefined();
          expect(response.body.lasercutter._id).toEqual(responseMachine._id);
          request.get(`${endpoint}/${responseMachine._id}`, {
            headers: { 'content-type': 'application/json' },
            json: true
          }, (error, response) => {
            expect(response.statusCode).toEqual(404);
            expect(response.body.lasercutter).toBeUndefined();
            done();
          });
        });
    });
  });

  it('delete lasercutter (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, { json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete lasercutter (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, { json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('get lasercutter (success)', (done) => {
    request.post(`${endpoint}/`, { body: testLasercutter, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      const id = response.body.lasercutter._id;
      request.get(`${endpoint}/${id}`, { headers: { 'content-type': 'application/json' } }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });
  });

  it('get lasercutter (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, { json: true }, (error, response) => {
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
});
