import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

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
    request.get(`${endpoint}machines/millingMachines`, (error, response) => {
      const millingMachines = JSON.parse(response.body).millingMachines;
      expect(response.statusCode).toEqual(200);
      expect(millingMachines).toBeDefined();
      expect(millingMachines.length).toBeGreaterThan(-1);
      expect(millingMachines[0].type).toEqual('millingMachine');
      done();
    });
  });

  it('create milling machine  (success)', (done) => {
    request.post(`${endpoint}machines/millingMachines/create`,
      { body: testMillingMachine, json: true }, (error, response) => {
        const millingMachine = response.body.millingMachine;
        expect(response.statusCode).toEqual(200);
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
    request.post(`${endpoint}machines/millingMachines/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create milling machine  (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testMillingMachine));
    testBody.fablabId = 'tooShortForMongoDB23';
    request.post(`${endpoint}machines/millingMachines/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create milling machine (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testMillingMachine));
    testBody.fablabId = 'tooLongForMongoDBsObjectId1234567890';
    request.post(`${endpoint}machines/millingMachines/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
