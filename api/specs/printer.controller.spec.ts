import 'jasmine';
import * as request from 'request';
import * as configs from '../config';

const endpoint = configs.configArr.prod.baseUrlBackend;

describe('Printer Controller', () => {
    it('gets printers', (done) => {
        request.get(`${endpoint}machine/printer`, (error, response) => {
            const printers = JSON.parse(response.body).printers;
            expect(response.statusCode).toEqual(200);
            expect(printers).toBeDefined();
            expect(printers.length).toBeGreaterThan(-1);
            expect(printers[0].type).toEqual('printer');
            done();
        });
    });
});
