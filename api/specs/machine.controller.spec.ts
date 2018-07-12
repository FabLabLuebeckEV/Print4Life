import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Machine Controller', () => {
  it('Get Printers', (done) => {
    request.get(`${endpoint}machine/printer`, (error, response) => {
      const printers = JSON.parse(response.body).printers;
      expect(response.statusCode).toEqual(200);
      expect(printers.length).toBeGreaterThan(0);
      done();
    });
  });
});
