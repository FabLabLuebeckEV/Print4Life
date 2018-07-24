import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Lasercutter Controller', () => {
  it('gets lasercutters', (done) => {
    request.get(`${endpoint}machine/lasercutter`, (error, response) => {
      const lasercutters = JSON.parse(response.body).lasercutters;
      expect(response.statusCode).toEqual(200);
      expect(lasercutters).toBeDefined();
      expect(lasercutters.length).toBeGreaterThan(-1);
      expect(lasercutters[0].type).toEqual('lasercutter');
      done();
    });
  });
});
