import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

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
    request.get(`${endpoint}machines/lasercutters`, (error, response) => {
      const lasercutters = JSON.parse(response.body).lasercutters;
      expect(response.statusCode).toEqual(200);
      expect(lasercutters).toBeDefined();
      expect(lasercutters.length).toBeGreaterThan(-1);
      expect(lasercutters[0].type).toEqual('lasercutter');
      done();
    });
  });

  it('create lasercutter (success)', (done) => {
    request.post(`${endpoint}machines/lasercutters/create`,
      { body: testLasercutter, json: true }, (error, response) => {
        const lasercutter = response.body.lasercutter;
        expect(response.statusCode).toEqual(200);
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
    request.post(`${endpoint}machines/printers/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create lasercutter (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testLasercutter));
    testBody.fablabId = 'tooShortForMongoDB23';
    request.post(`${endpoint}machines/printers/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create lasercutter (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testLasercutter));
    testBody.fablabId = 'tooLongForMongoDBsObjectId1234567890';
    request.post(`${endpoint}machines/printers/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
