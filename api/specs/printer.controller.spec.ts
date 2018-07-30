import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

const testPrinter = {
  fablabId: '5b453ddb5cf4a9574849e98a',
  deviceName: 'Test Printer',
  manufacturer: 'Test Manufacturer',
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
  pictureURL: '',
  comment: 'Create Test'
};

describe('Printer Controller', () => {
  it('gets printers', (done) => {
    request.get(`${endpoint}machines/printers`, (error, response) => {
      const printers = JSON.parse(response.body).printers;
      expect(response.statusCode).toEqual(200);
      expect(printers).toBeDefined();
      expect(printers.length).toBeGreaterThan(-1);
      expect(printers[0].type).toEqual('printer');
      done();
    });
  });

  it('create printer (success)', (done) => {
    request.post(`${endpoint}machines/printers/create`, { body: testPrinter, json: true }, (error, response) => {
      const printer = response.body.printer;
      expect(response.statusCode).toEqual(200);
      expect(printer).toBeDefined();
      expect(printer.deviceName).toEqual(testPrinter.deviceName);
      expect(printer.type).toEqual('printer');
      expect(printer.manufacturer).toEqual(testPrinter.manufacturer);
      expect(printer.fablabId).toEqual(testPrinter.fablabId);
      done();
    });
  });

  it('create printer (missing fablabId)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testPrinter));
    delete testBody.fablabId;
    request.post(`${endpoint}machines/printers/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create printer (fablabId too short)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testPrinter));
    testBody.fablabId = 'tooShortForMongoDB23';
    request.post(`${endpoint}machines/printers/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create printer (fablabId too long)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testPrinter));
    testBody.fablabId = 'tooLongForMongoDBsObjectId1234567890';
    request.post(`${endpoint}machines/printers/create`, { body: testBody, json: true }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
