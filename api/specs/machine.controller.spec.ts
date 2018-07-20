import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Machine Controller', () => {
  it('gets printers', (done) => {
    request.get(`${endpoint}machine/printer`, (error, response) => {
      const printers = JSON.parse(response.body).printers;
      expect(response.statusCode).toEqual(200);
      expect(printers).toBeDefined();
      expect(printers.length).toBeGreaterThan(-1);
      done();
    });
  });

  it('gets lasercutters', (done) => {
    request.get(`${endpoint}machine/lasercutter`, (error, response) => {
      const lasercutters = JSON.parse(response.body).lasercutters;
      expect(response.statusCode).toEqual(200);
      expect(lasercutters).toBeDefined();
      expect(lasercutters.length).toBeGreaterThan(-1);
      done();
    });
  });

  it('gets other machines', (done) => {
    request.get(`${endpoint}machine/otherMachine`, (error, response) => {
      const otherMachines = JSON.parse(response.body).otherMachines;
      expect(response.statusCode).toEqual(200);
      expect(otherMachines).toBeDefined();
      expect(otherMachines.length).toBeGreaterThan(-1);
      done();
    });
  });

  it('gets milling machines', (done) => {
    request.get(`${endpoint}machine/millingMachine`, (error, response) => {
      const millingMachines = JSON.parse(response.body).millingMachines;
      expect(response.statusCode).toEqual(200);
      expect(millingMachines).toBeDefined();
      expect(millingMachines.length).toBeGreaterThan(-1);
      done();
    });
  });

  it('gets all machines', (done) => {
    request.get(`${endpoint}machine/`, (error, response) => {
      const machines = JSON.parse(response.body).machines;
      expect(response.statusCode).toEqual(200);
      expect(machines).toBeDefined();
      expect(Object.keys(machines).length).toBeGreaterThan(0);
      Object.keys(machines).forEach((machineType) => {
        expect(machines[machineType]).toBeDefined();
        expect(machines[machineType].length).toBeGreaterThan(-1);
      });
      done();
    });
  });
});
