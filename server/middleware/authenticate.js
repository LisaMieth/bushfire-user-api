import User from '../models/user';

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token).then(user => {
    /* eslint-disable consistent-return */
    if (!user) return Promise.reject();

    /* eslint-disable no-param-reassign */
    req.user = user;
    req.token = token;
    /* eslint-enable no-param-reassign */
    next();
    return;
  }).catch(() => res.sendStatus(401));
};

module.exports = authenticate;
