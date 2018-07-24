import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Other Machine Controller', () => {
    it('gets other machines', (done) => {
        request.get(`${endpoint}machine/otherMachine`, (error, response) => {
            const otherMachines = JSON.parse(response.body).otherMachines;
            expect(response.statusCode).toEqual(200);
            expect(otherMachines).toBeDefined();
            expect(otherMachines.length).toBeGreaterThan(-1);
            expect(otherMachines[0].type).toEqual('otherMachine');
            done();
        });
    });
});
