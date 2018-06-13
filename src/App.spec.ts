import * as supertest from 'supertest';
import app from './App';

describe('App', () => {
  it('root', () => {
    supertest(app)
      .get('/')
      .expect('Content-Type', /plain-text/)
      .expect(200)
  });
  it('helloWorld', () =>
    supertest(app)
      .get('/api/v1/helloworld')
      .expect('Content-Type', /json/)
      .expect(200)
  );
});
