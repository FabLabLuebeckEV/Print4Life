import logger from '../logger';
import validatorService from './validator.service';
import config from '../config/config';

async function jwtValid (req, res, next) {
  let ret;
  let msg = 'Unauthorized! Please login with a user who is allowed to use this route';
  const tokenOk = await validatorService.checkToken(req);
  if (_isPublicRoute(req.originalUrl, req.method) || tokenOk) {
    ret = next();
  } else if (!tokenOk) {
    msg = 'Token expired. Please login again!';
    logger.error(msg);
    ret = res.status(401).send({ error: msg });
  } else {
    logger.error(msg);
    ret = res.status(403).send({ error: msg });
  }
  return ret;
}

function _isPublicRoute (url, method) {
  let isPublic = false;
  config.publicRoutes.forEach((route) => {
    let methodOk = false;
    route.methods.forEach((m) => {
      if (m.toLowerCase() === method.toLowerCase() || m.toLowerCase() === '*') {
        methodOk = true;
      }
    });
    if (methodOk) {
      if (route.canChilds) {
        if (url.startsWith(route.url)) {
          isPublic = true;
        }
      } else if (url === route.url) {
        isPublic = true;
      }
    }
  });
  return isPublic;
}

export default {
  jwtValid
};
