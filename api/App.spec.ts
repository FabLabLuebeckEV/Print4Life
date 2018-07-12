import 'jasmine';

import * as request from 'request';
import * as configs from './config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('App', () => {
  it('root', () => {
    request.get(endpoint, (error, response) => {
      expect(response.statusCode).toEqual(200);
    });
  });
  it('getPrinters', () => {
    request.get(`${endpoint}machine/printer`, (error, response) => {
      expect(response.statusCode).toEqual(200);
    });
  });
});
