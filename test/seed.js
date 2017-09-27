import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import User from '../server/models/user';

const user1Id = new ObjectID();
const user2Id = new ObjectID();

export const users = [{
  _id: user1Id,
  name: 'Lisa',
  email: 'lisa@gmail.com',
  password: 'password1',
  suburb: 'Richmond',
  state: 'NSW',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: user1Id, access: 'auth' }, 'abc123').toString(),
  }],
}, {
  _id: user2Id,
  name: 'Amir',
  email: 'amir@gmail.com',
  password: 'password2',
  suburb: 'Windsor',
  state: 'NSW',
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    Promise.all([userOne, userTwo]);
  }).then(done);
};

module.exports = { users, populateUsers };
