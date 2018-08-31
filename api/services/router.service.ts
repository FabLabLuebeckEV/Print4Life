import logger from '../logger';
import validatorService from './validator.service';
import config from '../config/config';

// TODO: Fill with magic and check if JWT is in user entity in database and jwt not expired
function jwtValid (req, res, next) {
  let ret;
  const msg = 'Unauthorized! Please login with a user who is allowed to use this route';
  if (_isPublicRoute(req.originalUrl) || validatorService.checkToken(req)) {
    ret = next();
  } else {
    logger.error(msg);
    ret = res.status(401).send({ error: msg });
  }
  return ret;
}

function _isPublicRoute (url) {
  let isPublic = false;
  config.publicRoutes.forEach((route) => {
    if (url === route) {
      isPublic = true;
    }
  });
  return isPublic;
}

export default {
  jwtValid
};
