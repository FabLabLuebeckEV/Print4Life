import 'jasmine';
import * as request from 'request';
import config from '../config/config';
import { getTestUserToken, newTimeout } from './global.spec';

const endpoint = `${config.baseUrlBackend}fablabs`;

const testFablab = {
  name: 'Fablab Ostsee e.V.',
  address: {
    street: 'Milkyway 5',
    zipCode: '33445',
    city: 'City of Nowhere',
    country: 'Dreamland'
  }
};

describe('Fablab Controller', () => {
  let originalTimeout;
  const authorizationHeader = getTestUserToken();
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = newTimeout;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('gets all fablabs', (done) => {
    request.get(`${endpoint}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      const fablabs = response.body.fablabs;
      expect(response.statusCode).toEqual(200);
      expect(fablabs).toBeDefined();
      expect(fablabs.length).toBeGreaterThan(0);
      done();
    });
  });

  it('gets fablab by id (positive number)', (done) => {
    request.get(`${endpoint}/5b453ddb5cf4a9574849e98a`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      const fablab = response.body.fablab;
      expect(response.statusCode).toEqual(200);
      expect(fablab).toBeDefined();
      done();
    });
  });

  it('gets fablab by id (negative number)', (done) => {
    request.get(`${endpoint}/-1`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (alphanumeric)', (done) => {
    request.get(`${endpoint}/a12`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (letters)', (done) => {
    request.get(`${endpoint}/abba`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('gets fablab by id (not found)', (done) => {
    request.get(`${endpoint}/5b453ddb5cf4a95748499999`,
      {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      },
      (error, response) => {
        expect(response.statusCode).toEqual(404);
        done();
      });
  });

  it('create fablab (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testFablab,
      json: true
    }, (error, response) => {
      const fablab = response.body.fablab;
      expect(response.statusCode).toEqual(201);
      expect(fablab).toBeDefined();
      expect(fablab.name).toEqual(testFablab.name);
      expect(fablab.address).toBeDefined();
      expect(fablab.address.street).toEqual(testFablab.address.street);
      expect(fablab.address.zipCode).toEqual(testFablab.address.zipCode);
      expect(fablab.address.city).toEqual(testFablab.address.city);
      expect(fablab.address.country).toEqual(testFablab.address.country);
      done();
    });
  });

  it('create fablab (missing name)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testFablab));
    delete testBody.name;
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testBody,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('create fablab (missing address)', (done) => {
    const testBody = JSON.parse(JSON.stringify(testFablab));
    delete testBody.address;
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testBody,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update fablab (success)', (done) => {
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testFablab,
      json: true
    }, (error, response) => {
      const fablab = response.body.fablab;
      expect(response.statusCode).toEqual(201);
      expect(fablab).toBeDefined();
      expect(fablab.name).toEqual(testFablab.name);
      expect(fablab.address).toBeDefined();
      expect(fablab.address.street).toEqual(testFablab.address.street);
      expect(fablab.address.zipCode).toEqual(testFablab.address.zipCode);
      expect(fablab.address.city).toEqual(testFablab.address.city);
      expect(fablab.address.country).toEqual(testFablab.address.country);
      fablab.name = 'Updated';
      delete fablab.__v;
      request.put(`${endpoint}/${fablab._id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        body: fablab,
        json: true
      }, (error, response) => {
        const updatedFablab = response.body.fablab;
        expect(response.statusCode).toEqual(200);
        expect(updatedFablab).toBeDefined();
        expect(updatedFablab.name).toEqual('Updated');
        expect(updatedFablab.address).toBeDefined();
        expect(updatedFablab.address.street).toEqual(testFablab.address.street);
        expect(updatedFablab.address.zipCode).toEqual(testFablab.address.zipCode);
        expect(updatedFablab.address.city).toEqual(testFablab.address.city);
        expect(updatedFablab.address.country).toEqual(testFablab.address.country);
        done();
      });
    });
  });

  it('update fablab (id too short)', (done) => {
    const id = 'tooShortForMongoDB23';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testFablab,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('update fablab (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.put(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testFablab,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete printer (success)', (done) => {
    let responseFablab;
    request.post(`${endpoint}/`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      body: testFablab,
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(201);
      responseFablab = response.body.fablab;
      request.delete(`${endpoint}/${response.body.fablab._id}`, {
        headers: { 'content-type': 'application/json', authorization: authorizationHeader },
        json: true
      }, (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.fablab).toBeDefined();
        expect(response.body.fablab._id).toEqual(responseFablab._id);
        expect(response.body.fablab.activated).toEqual(false);
        done();
      });
    });
  });

  it('delete printer (id too long)', (done) => {
    const id = 'tooLongForMongoDBsObjectId1234567890';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });

  it('delete printer (id too short)', (done) => {
    const id = 'tooShort';
    request.delete(`${endpoint}/${id}`, {
      headers: { 'content-type': 'application/json', authorization: authorizationHeader },
      json: true
    }, (error, response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
