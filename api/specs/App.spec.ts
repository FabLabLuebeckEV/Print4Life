import 'jasmine';
import * as request from 'request';
import * as configs from '../config/config';
import { getTestUserToken } from './global.spec';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('App', () => {
  const token = getTestUserToken();
  it('root', (done) => {
    request.get(endpoint, {
      headers: { 'content-type': 'application/json', authorization: token },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
