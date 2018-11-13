import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken } from './global.spec';

const endpoint = config.baseUrlBackend;

describe('App', () => {
  const token = getTestUserToken();
  it('root', (done) => {
    request.get(`${endpoint}/version`, {
      headers: { 'content-type': 'application/json', authorization: token },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
