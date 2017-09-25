import express from 'express';
import bodyParser from 'body-parser';

import { mongoose } from './db/mongoose';
import User from './models/user';

const port = 3000;
const app = express();

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
  });

  user.save()
    .then(doc => res.send(doc))
    .catch(e => res.status(400).send(e));
});

app.listen(port, () => console.log(`Started on port ${port}`));

module.exports = app;
