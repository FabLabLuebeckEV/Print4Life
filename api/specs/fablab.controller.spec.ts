import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Fablab Controller', () => {
  it('gets all fablabs', (done) => {
    request.get(`${endpoint}fablabs`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const fablabs = response.body.fablabs;
      expect(response.statusCode).toEqual(200);
      expect(fablabs).toBeDefined();
      expect(fablabs.length).toBeGreaterThan(0);
      done();
    });
  });

  it('gets fablab by id (positive number)', (done) => {
    request.get(`${endpoint}fablabs/5b453ddb5cf4a9574849e98a`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      const fablab = response.body.fablab;
      expect(response.statusCode).toEqual(200);
      expect(fablab).toBeDefined();
      done();
    });
  });

  it('gets fablab by id (negative number)', (done) => {
    request.get(`${endpoint}fablabs/-1`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (alphanumeric)', (done) => {
    request.get(`${endpoint}fablabs/a12`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (letters)', (done) => {
    request.get(`${endpoint}fablabs/abba`, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (not found)', (done) => {
    request.get(`${endpoint}fablabs/5b453ddb5cf4a95748499999`,
      { headers: { 'content-type': 'application/json' }, json: true },
      (error, response) => {
        expect(response.statusCode).toEqual(404);
        done();
      });
  });
});
