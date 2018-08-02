import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend + 'machines/otherMachines';

const testOtherMachine = {
  fablabId: '5b453ddb5cf4a9574849e98a',
  deviceName: 'Test Other Machine',
  manufacturer: 'Test Manufacturer',
  typeOfMachine: 'Test Machine',
  pictureURL: '',
  comment: 'Create Test'
};

describe('Other Machine Controller', () => {
  it('gets other machines', (done) => {
    request.get(`${endpoint}`, (error, response) => {
      const otherMachines = JSON.parse(response.body).otherMachines;
      expect(response.statusCode).toEqual(200);
      expect(otherMachines).toBeDefined();
      expect(otherMachines.length).toBeGreaterThan(-1);
      expect(otherMachines[0].type).toEqual('otherMachine');
      done();
    });
  });

  it('create milling machine  (success)', (done) => {
    request.post(`${endpoint}/create`,
      { body: testOtherMachine, json: true }, (error, response) => {
        const otherMachine = response.body.otherMachine;
        expect(response.statusCode).toEqual(201);
        expect(otherMachine).toBeDefined();
        expect(otherMachine.deviceName).toEqual(testOtherMachine.deviceName);
        expect(otherMachine.type).toEqual('otherMachine');
        expect(otherMachine.manufacturer).toEqual(testOtherMachine.manufacturer);
        expect(otherMachine.fablabId).toEqual(testOtherMachine.fablabId);
        done();
      });
  });

  it('create milling machine  (missing fablabId)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOtherMachine));
    delete testBody.fablabId;
    request.post(`${endpoint}/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create milling machine  (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOtherMachine));
    testBody.fablabId = 'tooShortForMongoDB23';
    request.post(`${endpoint}/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create milling machine (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testOtherMachine));
    testBody.fablabId = 'tooLongForMongoDBsObjectId1234567890';
    request.post(`${endpoint}/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
