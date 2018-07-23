import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Fablab Controller', () => {
  it('gets fablab by id (positive number)', (done) => {
    request.get(`${endpoint}fablab/1`, (error, response) => {
      const fablab = JSON.parse(response.body).fablab;
      expect(response.statusCode).toEqual(200);
      expect(fablab).toBeDefined();
      done();
    });
  });

  it('gets fablab by id (negative number)', (done) => {
    request.get(`${endpoint}fablab/-1`, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (alphanumeric)', (done) => {
    request.get(`${endpoint}fablab/a12`, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (letters)', (done) => {
    request.get(`${endpoint}fablab/abba`, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (not found)', (done) => {
    request.get(`${endpoint}fablab/9999`, (error, response) => {
      expect(response.statusCode).toEqual(404);
      done();
    });
  });
});
