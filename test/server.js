import expect from 'expect';
import request from 'supertest';

import app from '../server/server';
import User from '../server/models/user';
import { users, populateUsers } from './seed';

beforeEach(populateUsers);

describe('POST /users', () => {
  it('should create a new user', () => {
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
});
