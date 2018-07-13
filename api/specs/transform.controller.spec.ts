import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Machine Controller', () => {
  it('transforms Milling Machines', (done) => {
    request.get(`${endpoint}transform/milling`, (error, response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(Object.keys(body)).toEqual(['msg']);
      done();
    });
  });
  it('transforms Laser Cutters', (done) => {
    request.get(`${endpoint}transform/lasercutter`, (error, response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(Object.keys(body)).toEqual(['msg']);
      done();
    });
  });
  it('transforms Other Machines', (done) => {
    request.get(`${endpoint}transform/other`, (error, response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(Object.keys(body)).toEqual(['msg']);
      done();
    });
  });
  it('transforms Printers', (done) => {
    request.get(`${endpoint}transform/printer`, (error, response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(Object.keys(body)).toEqual(['msg']);
      done();
    });
  });
  it('cleans database documents of unneeded fields', (done) => {
    request.get(`${endpoint}transform/cleanDocuments`, (error, response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body.updated.length).toBeGreaterThan(0);
      done();
    });
  });
});
