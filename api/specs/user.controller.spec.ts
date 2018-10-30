import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { testUser, getTestUserToken, newTimeout } from './global.spec';

const endpoint = config.baseUrlBackend;

describe('User Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('create user', (done) => {
    testUser.username += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    testUser.email += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    request.post(
      `${endpoint}users/`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: testUser
      },
      (error, response) => {
        const user = response.body.user;
        expect(response.statusCode).toEqual(200);
        expect(user).toBeDefined();
        expect(user.username).toEqual(testUser.username);
        expect(user.firstname).toEqual(testUser.firstname);
        expect(user.lastname).toEqual(testUser.lastname);
        expect(user.email).toEqual(testUser.email);
        expect(user.role.role).toEqual(testUser.role.role);
        expect(user.preferredLanguage.language).toEqual('en');
        expect(user.address.street).toEqual(testUser.address.street);
        expect(user.address.zipCode).toEqual(testUser.address.zipCode);
        expect(user.address.city).toEqual(testUser.address.city);
        expect(user.address.country).toEqual(testUser.address.country);
        done();
      });
  });

  it('user login', (done) => {
    testUser.username += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    testUser.email += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    request.post(
      `${endpoint}users/`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: testUser
      },
      (error, response) => {
        const user = response.body.user;
        request.post(
          `${endpoint}users/login`, {
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: { username: user.username, password: testUser.password }
          }, ((error, response) => {
            expect(error).toBeNull();
            expect(response).toBeDefined();
            expect(response.body.login).toBeDefined();
            expect(response.body.login.token).toBeDefined();
            expect(response.body.login.success).toBeTruthy();
            done();
          }));
      });
  });

  it('user reset password', (done) => {
    testUser.username += `${Math.random().toString(36).substring(2, 15)}`;
    testUser.email += `${Math.random().toString(36).substring(2, 15)}`;
    request.post(
      `${endpoint}users/`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: testUser
      },
      (error, response) => {
        const user = response.body.user;
        request.put(
          `${endpoint}users/${user._id}/changePassword`, {
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: { oldPassword: testUser.password, newPassword: 'newPassword' }
          }, ((error, response) => {
            expect(error).toBeNull();
            expect(response).toBeDefined();
            expect(response.body.msg).toBeDefined();
            done();
          }));
      });
  });

  it('user login fails', (done) => {
    testUser.username += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    testUser.email += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    request.post(
      `${endpoint}users/`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: testUser
      },
      (error, response) => {
        const user = response.body.user;
        request.post(
          `${endpoint}users/login`, {
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
            body: { username: user.username, password: 'definetly not my password' }
          }, ((error, response) => {
            expect(error).toBeNull();
            expect(response).toBeDefined();
            expect(response.body.login).toBeDefined();
            expect(response.body.login.token).toBeUndefined();
            expect(response.body.login.success).toBeFalsy();
            done();
          }));
      });
  });

  it('gets roles', (done) => {
    request({
      uri: `${endpoint}users/roles`,
      method: 'GET',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.body.roles).toBeDefined();
      expect(response.body.roles.length).toBeGreaterThan(0);

      expect(response.body.roles.includes('guest')).toEqual(true);
      expect(response.body.roles.includes('admin')).toEqual(true);
      expect(response.body.roles.includes('user')).toEqual(true);
      expect(response.body.roles.includes('editor')).toEqual(true);
      done();
    });
  });

  it('gets languages', (done) => {
    request({
      uri: `${endpoint}users/languages`,
      method: 'GET',
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.body.languages).toBeDefined();
      expect(response.body.languages.length).toBeGreaterThan(0);

      expect(response.body.languages.includes('de')).toEqual(true);
      expect(response.body.languages.includes('en')).toEqual(true);
      expect(response.body.languages.includes('dk')).toEqual(true);
      done();
    });
  });

  it('counts users', (done) => {
    request.post(`${endpoint}users/count`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true,
      body: {
        query: {
          $or: [
            {
              role: {
                role: 'user'
              }
            },
            {
              role: {
                role: 'admin'
              }
            }
          ]
        }
      }
    }, (error, response) => {
      const count = response.body.count;
      expect(response.statusCode).toEqual(200);
      expect(count).toBeDefined();
      expect(count).toBeGreaterThan(-1);
      done();
    });
  });

  it('user get name', (done) => {
    testUser.username += `${Math.random().toString(36).substring(2, 15)}`;
    testUser.firstname = 'Hello';
    testUser.lastname = 'World!';
    testUser.email += `${Math.random().toString(36).substring(2, 15)}`;
    request.post(
      `${endpoint}users/`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true,
        body: testUser
      },
      (error, response) => {
        const user = response.body.user;
        request.get(
          `${endpoint}users/${user._id}/getNames`, {
            headers: { 'content-type': 'application/json', authorization: authorizationHeader },
            json: true,
          }, ((error, response) => {
            const user = response.body.user;
            expect(error).toBeNull();
            expect(response).toBeDefined();
            expect(user).toBeDefined();
            expect(user.firstname).toEqual(testUser.firstname);
            expect(user.lastname).toEqual(testUser.lastname);
            done();
          }));
      });
  });
});
