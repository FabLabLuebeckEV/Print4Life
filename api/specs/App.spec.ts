import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('App', () => {
  it('root', (done) => {
    request.get(endpoint, (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
