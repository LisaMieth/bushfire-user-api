import expect from 'expect';
import request from 'supertest';

import app from '../server/server';
import User from '../server/models/user';
import { users, populateUsers } from './seed';

beforeEach(populateUsers);

describe('POST /users', () => {
  it('should create a new user', (done) => {
    const user = {
      name: 'Babs',
      email: 'babs@gmail.com',
      password: '1234567',
      suburb: 'Surry Hills',
      state: 'NSW',
    };

    request(app)
      .post('/users')
      .send(user)
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(user.email);
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findOne({ email: user.email }).then(responseUser => {
          expect(responseUser).toExist();
          expect(responseUser.password).toNotBe(user.password)
          done();
        }).catch(e => done(e));
      });
  });

  it('should return validation error if request invalid', (done) => {
    const user = {
      name: 'Babs',
      password: '1234567',
      suburb: 'Surry Hills',
      state: 'NSW',
    };

    request(app)
      .post('/users')
      .send(user)
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send(users[0])
      .expect(400)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if unauthorised', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .end(done);
  });
});
