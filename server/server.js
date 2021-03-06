import './config/config';
import express from 'express';
import bodyParser from 'body-parser';

import User from './models/user';
import authenticate from './middleware/authenticate';
// Get mongoose config
// eslint-disable-next-line no-unused-vars
import mongoose from './db/mongoose';

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());

// SIGN UP ROUTE
app.post('/users', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    suburb: req.body.suburb,
    state: req.body.state.toUpperCase(),
    importantOnly: req.body.importantOnly,
  });

  user.save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send(user))
    .catch(e => res.status(400).send(e));
});

// USER PROFILE ROUTE
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// LOGIN ROUTE
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  User.findByCredentials(email, password)
    .then(user => user.generateAuthToken().then(token => res.header('x-auth', token).send(user)))
    .catch(() => res.sendStatus(400));
});

app.listen(port, () => console.log(`Started on port ${port}`));

module.exports = app;
