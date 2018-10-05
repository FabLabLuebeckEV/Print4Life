

import * as request from 'request';
import * as configs from '../config/config';
import { User } from '../models/user.model';
import { JWT } from '../models/jwt.model';
import { Role } from '../models/role.model';

const Jasmine = require('jasmine');
const server = require('../index');

const jasmineLib = new Jasmine();
export const testUser = {
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
  role: {
    role: 'admin'
  },
  createdAt: undefined
};
export const newTimeout = 60 * 1000;

let token;

server.run();
User.findOne({ username: testUser.username }).then(async (result) => {
  if (!result) {
    testUser.createdAt = new Date();
    const newUser = new User({
      ...testUser
    });
    const role = new Role();
    if (testUser.role) {
      role.role = testUser.role.role;
    }
    newUser.role = role;
    await newUser.save();
    await request.post(
      `${configs.configArr.prod.baseUrlBackend}users/login`, {
        headers: { 'content-type': 'application/json' },
        json: true,
        body: { username: testUser.username, password: testUser.password }
      }, async (err, response) => {
        if (response && response.body && response.body.login && response.body.login.token) {
          token = response.body.login.token.split('JWT')[1].trim();
          newUser.jwt = new JWT({ token, issuedAt: new Date() });
          await newUser.save();
          startJasmin();
        }
      });
  } else {
    token = result.jwt.token;
    result.jwt.issuedAt = new Date();
    await result.save();
    startJasmin();
  }
});

function startJasmin () {
  jasmineLib.loadConfig({
    spec_dir: 'dist/specs',
    spec_files: ['**/*[sS]pec.js']
  });

  jasmineLib.execute();
}

export const getTestUserToken = () => `JWT ${token}`;
