import * as request from 'request';

import 'jasmine';

const endpoint = 'http://localhost:3000/api/v1/';

describe('App', () => {
  it('root', () => {
    request.get(endpoint, (error, response) => {
      expect(response.statusCode).toEqual(200);
    });
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
