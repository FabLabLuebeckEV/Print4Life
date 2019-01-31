import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';
import { ErrorType } from '../services/router.service';

const endpoint = `${config.baseUrlBackend}octoprint`;

describe('Octoprint Controller', () => {
    let originalTimeout: number;
    const authorizationHeader = getTestUserToken();
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
    });
    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('upload file (missing apiKey)', (done) => {
        const testBody = { octoprintAddress: 'http://localhost:5000' };
        const fileId = '12345678901234567890abcd';
        request({
            uri: `${endpoint}/uploadFile/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            expect(response.body.name).toEqual('MALFORMED_REQUEST');
            expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
            done();
        });
    });

    it('upload file (missing address)', (done) => {
        const testBody = { apiKey: 'Invalid API Key' };
        const fileId = '12345678901234567890abcd';
        request({
            uri: `${endpoint}/uploadFile/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            expect(response.body.name).toEqual('MALFORMED_REQUEST');
            expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
            done();
        });
    });

    it('upload file (id too short)', (done) => {
        const testBody = { apiKey: 'Invalid API Key', octoprintAddress: 'http://localhost:5000' };
        const fileId = '1234';
        request({
            uri: `${endpoint}/uploadFile/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            done();
        });
    });

    it('upload file (id too long)', (done) => {
        const testBody = { apiKey: 'Invalid API Key', octoprintAddress: 'http://localhost:5000' };
        const fileId = '12345678901234567890abcdefg';
        request({
            uri: `${endpoint}/uploadFile/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            done();
        });
    });

    it('upload file (id too long)', (done) => {
        const testBody = { apiKey: 'Invalid API Key', octoprintAddress: 'http://localhost:5000' };
        const fileId = '12345678901234567890abcdefg';
        request({
            uri: `${endpoint}/uploadFile/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            done();
        });
    });

    it('print file (missing apiKey)', (done) => {
        const testBody = { octoprintAddress: 'http://localhost:5000' };
        const fileId = '12345678901234567890abcd';
        request({
            uri: `${endpoint}/print/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            expect(response.body.name).toEqual('MALFORMED_REQUEST');
            expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
            done();
        });
    });

    it('print file (missing address)', (done) => {
        const testBody = { apiKey: 'Invalid API Key' };
        const fileId = '12345678901234567890abcd';
        request({
            uri: `${endpoint}/print/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            expect(response.body.name).toEqual('MALFORMED_REQUEST');
            expect(response.body.type).toEqual(ErrorType.MALFORMED_REQUEST);
            done();
        });
    });

    it('print file (id too short)', (done) => {
        const testBody = { apiKey: 'Invalid API Key', octoprintAddress: 'http://localhost:5000' };
        const fileId = '1234';
        request({
            uri: `${endpoint}/print/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            done();
        });
    });

    it('print file (id too long)', (done) => {
        const testBody = { apiKey: 'Invalid API Key', octoprintAddress: 'http://localhost:5000' };
        const fileId = '12345678901234567890abcdefg';
        request({
            uri: `${endpoint}/print/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            done();
        });
    });

    it('print file (id too long)', (done) => {
        const testBody = { apiKey: 'Invalid API Key', octoprintAddress: 'http://localhost:5000' };
        const fileId = '12345678901234567890abcdefg';
        request({
            uri: `${endpoint}/print/${fileId}`,
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: testBody
        }, (error, response) => {
            expect(response.statusCode).toEqual(400);
            expect(response.statusMessage).toEqual('Bad Request');
            expect(response.body).toBeDefined();
            done();
        });
    });
});
