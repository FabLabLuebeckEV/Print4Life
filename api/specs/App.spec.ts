import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('App', () => {
  it('root', (done) => {
    request.get(endpoint, {
      headers: { 'content-type': 'application/json' },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
