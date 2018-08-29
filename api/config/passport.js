import { Strategy, ExtractJwt } from 'passport-jwt';

// load up the user model
const User = require('../models/user');
const config = require('../config/database'); // get db config file

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      User.findOne({ id: jwtPayload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    }));
};
