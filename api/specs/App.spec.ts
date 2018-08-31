import 'jasmine';
import * as request from 'request';
import * as configs from '../config/config';

const endpoint = configs.configArr.prod.baseUrlBackend;
const authorizationHeader = 'Bearer TestUser';

describe('App', () => {
  it('root', (done) => {
    request.get(endpoint, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
