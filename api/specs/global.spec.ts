
import * as jwt from 'jsonwebtoken';
import * as request from 'request';
import * as configs from '../config/config';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

const Jasmine = require('jasmine');
const server = require('../index');

const env = process.env.NODE_ENV;
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
    role: 'user'
  },
  preferredLanguage: 'en',
  activated: true,
  createdAt: undefined
};
export const newTimeout = 60 * 1000;

let token;

server.run();
User.findOne({ username: testUser.username }).then(async (user) => {
  if (!user) {
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
          await newUser.save();
          startJasmin();
        }
      });
  } else {
    const signObj = {
      _id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      address: user.address ? user.address.toJSON() : undefined,
      password: user.password,
      role: user.role.toJSON(),
      createdAt: user.createdAt
    };
    token = jwt.sign(signObj, configs.configArr[env].jwtSecret, { expiresIn: configs.configArr[env].jwtExpiryTime });
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
