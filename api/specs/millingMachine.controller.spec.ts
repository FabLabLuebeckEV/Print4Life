import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Milling Machine Controller', () => {
  it('gets milling machines', (done) => {
    request.get(`${endpoint}machine/millingMachine`, (error, response) => {
      const millingMachines = JSON.parse(response.body).millingMachines;
      expect(response.statusCode).toEqual(200);
      expect(millingMachines).toBeDefined();
      expect(millingMachines.length).toBeGreaterThan(-1);
      expect(millingMachines[0].type).toEqual('millingMachine');
      done();
    });
  });
});
