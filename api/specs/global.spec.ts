
import * as jwt from 'jsonwebtoken';
import * as request from 'request';
import config from '../config/config';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

const Jasmine = require('jasmine');
const server = require('../index');

const jasmineLib = new Jasmine();
export const testUser = {
  id: '',
  firstname: 'Hans',
  lastname: 'Der Tester',
  username: 'Hansi',
  password: 'VeryInsecurePW',
  email: 'hansi@example.com',
  address: {
    street: 'Middlehofer Straße 42',
    zipCode: '421337',
    city: 'Geldhausen',
    country: 'Luxemburg',
  },
  role: {
    role: 'user'
  },
  preferredLanguage: {
    language: undefined
  },
  activated: true,
  createdAt: undefined
};

export const testUserEditor = {
  id: '',
  firstname: 'Hans',
  lastname: 'Der Tester',
  username: 'Hansi1',
  password: 'VeryInsecurePW1',
  email: 'hansi1@example.com',
  address: {
    street: 'Middlehofer Straße 42',
    zipCode: '421337',
    city: 'Geldhausen',
    country: 'Luxemburg',
  },
  role: {
    role: 'user'
  },
  preferredLanguage: {
    language: undefined
  },
  activated: true,
  createdAt: undefined
}
export const testUserNormal = {
  id: '',
  firstname: 'Hans',
  lastname: 'Der Tester',
  username: 'Hansi2',
  password: 'VeryInsecurePW2',
  email: 'hansi2@example.com',
  address: {
    street: 'Middlehofer Straße 42',
    zipCode: '421337',
    city: 'Geldhausen',
    country: 'Luxemburg',
  },
  role: {
    role: 'user'
  },
  preferredLanguage: {
    language: undefined
  },
  activated: true,
  createdAt: undefined
}
export const newTimeout = 60 * 1000;

let token;
let tokenEditor;
let tokenNormal;

server.run();
/* setup testUser */ 
User.findOne({ username: testUser.username }).then(async (user) => {
  if (!user) {
    testUser.createdAt = new Date();
    testUser.id = undefined;
    let newUser = new User({
      ...testUser
    });
    const role = new Role();
    if (testUser.role) {
      role.role = 'admin';
    }
    newUser.role = role;
    newUser = await newUser.save();
    testUser.id = newUser.id;
    await request.post(
      `${config.baseUrlBackend}users/login`, {
        headers: { 'content-type': 'application/json' },
        json: true,
        body: { username: testUser.username, password: testUser.password }
      }, async (err, response) => {
        if (response && response.body && response.body.login && response.body.login.token) {
          token = response.body.login.token.split('JWT')[1].trim();
          await newUser.save();
          createEditorUser();
        }
      }
    );
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
    testUser.id = user.id;
    token = jwt.sign(signObj, config.jwtSecret, { expiresIn: config.jwtExpiryTime });
    createEditorUser();
  }
});

function createEditorUser() {
  /* setup testUser */ 
  User.findOne({ username: testUserEditor.username }).then(async (user) => {
    if (!user) {
      testUserEditor.createdAt = new Date();
      testUserEditor.id = undefined;
      let newUser = new User({
        ...testUserEditor
      });
      const role = new Role();
      if (testUserEditor.role) {
        role.role = 'editor';
      }
      newUser.role = role;
      newUser = await newUser.save();
      testUserEditor.id = newUser.id;
      await request.post(
        `${config.baseUrlBackend}users/login`, {
          headers: { 'content-type': 'application/json' },
          json: true,
          body: { username: testUserEditor.username, password: testUserEditor.password }
        }, async (err, response) => {
          if (response && response.body && response.body.login && response.body.login.token) {
            tokenEditor = response.body.login.token.split('JWT')[1].trim();
            await newUser.save();
            createNormalUser();
          }
        }
      );
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
      testUserEditor.id = user.id;
      tokenEditor = jwt.sign(signObj, config.jwtSecret, { expiresIn: config.jwtExpiryTime });
      createNormalUser();
    }
  });
}

function createNormalUser() {
  /* setup testUser */ 
  User.findOne({ username: testUserNormal.username }).then(async (user) => {
    if (!user) {
      testUserNormal.createdAt = new Date();
      testUserNormal.id = undefined;
      let newUser = new User({
        ...testUserNormal
      });
      const role = new Role();
      if (testUserNormal.role) {
        role.role = 'user';
      }
      newUser.role = role;
      newUser = await newUser.save();
      testUserNormal.id = newUser.id;
      await request.post(
        `${config.baseUrlBackend}users/login`, {
          headers: { 'content-type': 'application/json' },
          json: true,
          body: { username: testUserNormal.username, password: testUserNormal.password }
        }, async (err, response) => {
          if (response && response.body && response.body.login && response.body.login.token) {
            tokenNormal = response.body.login.token.split('JWT')[1].trim();
            await newUser.save();
            startJasmin();
          }
        }
      );
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
      testUserNormal.id = user.id;
      tokenNormal = jwt.sign(signObj, config.jwtSecret, { expiresIn: config.jwtExpiryTime });
      startJasmin();
    }
  });
}

function startJasmin () {
  jasmineLib.loadConfig({
    spec_dir: 'dist/specs',
    spec_files: ['**/*[sS]pec.js']
  });

  jasmineLib.execute();
}

export const getTestUserToken = () => `JWT ${token}`;
export const getTestEditorToken = () => `JWT ${tokenEditor}`;
export const getTestUserNormalToken = () => `JWT ${tokenNormal}`;