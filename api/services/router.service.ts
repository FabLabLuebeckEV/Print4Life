import logger from '../logger';
import validatorService from './validator.service';
import config from '../config/config';

export enum ErrorType {
  TOKEN_EXPIRED,
  USER_DEACTIVATED,
  UNAUTHORIZED,
  USERNAME_EXISTS,
  EMAIL_EXISTS
}

export interface Error {
  stack: any;
  error: string;
  type: ErrorType;
}

async function jwtValid (req, res, next) {
  let ret;
  let error: Error;
  const tc = await validatorService.checkToken(req);
  let msg = 'Unauthorized! Please login with a user who is allowed to use this route';
  if (_isPublicRoute(req.originalUrl, req.method) || (tc && tc.tokenOk)) {
    ret = next();
  } else if (tc && !tc.tokenOk) {
    msg = 'Token expired. Please login again!';
    logger.error(`${tc.error.name}: ${msg}`);
    error = { error: msg, stack: '', type: ErrorType.TOKEN_EXPIRED };
    ret = res.status(401).send(error);
  } else {
    logger.error(msg);
    error = { error: msg, stack: '', type: ErrorType.UNAUTHORIZED };
    ret = res.status(403).send(error);
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
