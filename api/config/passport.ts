import {
  Strategy,
  ExtractJwt
} from 'passport-jwt';

// load up the user model
import { User } from '../models/user.model';
import config from '../config/config'; // get db config file

module.exports = function (passport) {
  const opts = { jwtFromRequest: '', secretOrKey: '' };
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.jwtSecret;
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      User.findOne({
        id: jwtPayload.id
      }, (err, user) => {
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
