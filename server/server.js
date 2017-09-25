import express from 'express';
import bodyParser from 'body-parser';

import User from './models/user';

const port = 3000;
const app = express();

app.use(bodyParser.json());

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

app.listen(port, () => console.log(`Started on port ${port}`));

module.exports = app;
