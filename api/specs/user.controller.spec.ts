import 'jasmine';
import * as request from 'request';
import * as configs from '../config/config';


const endpoint = configs.configArr.prod.baseUrlBackend;
const testUser = {
  firstname: 'Hans',
  lastname: 'Der Tester',
  username: 'Hansi',
  password: 'VeryInsecurePW',
  email: 'hansi@alm.de',
  address: {
    street: 'Middlehofer Straße 42',
    zipCode: '421337',
    city: 'Geldhausen',
    country: 'Luxemburg',
  },
  role: 'admin'
};

describe('User Controller', () => {
  it('create user', (done) => {
    testUser.username += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    testUser.email += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    request.post(
      `${endpoint}users/`, {
        headers: { 'content-type': 'application/json' },
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
        expect(user.role.role).toEqual(testUser.role);
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
        headers: { 'content-type': 'application/json' },
        json: true,
        body: testUser
      },
      (error, response) => {
        const user = response.body.user;
        request.post(
          `${endpoint}users/login`, {
            headers: { 'content-type': 'application/json' },
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

  it('user login fails', (done) => {
    testUser.username += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    testUser.email += `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    request.post(
      `${endpoint}users/`, {
        headers: { 'content-type': 'application/json' },
        json: true,
        body: testUser
      },
      (error, response) => {
        const user = response.body.user;
        request.post(
          `${endpoint}users/login`, {
            headers: { 'content-type': 'application/json' },
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
      headers: { 'content-type': 'application/json' },
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
});
