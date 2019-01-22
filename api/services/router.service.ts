import logger from '../logger';
import validatorService from './validator.service';
import config from '../config/config';

export enum ErrorType {
  TOKEN_EXPIRED,
  USER_DEACTIVATED,
  UNAUTHORIZED,
  USERNAME_EXISTS,
  EMAIL_EXISTS,
  AUTHENTIFICATION_FAILED,
  MACHINE_TYPE_NOT_SUPPORTED,
  MACHINE_NOT_FOUND,
  UPLOAD_FILE_ERROR,
  DOWNLOAD_FILE_ERROR,
  DELETE_FILE_ERROR,
  INVALID_ID,
  FORBIDDEN,
  SERVER_ERROR,
  MALFORMED_REQUEST,
  IOT_DEVICE_EXISTS
}

/* eslint-disable no-restricted-globals */
export interface IError extends Error {
  name: string;
  stack?: string;
  data?: any;
  message: string;
  type: ErrorType;
}
/* eslint-enable no-restricted-globals */

async function jwtValid (req, res, next) {
  let ret;
  let error: IError;
  const tc = await validatorService.checkToken(req);
  let msg = 'Unauthorized! Please login with a user who is allowed to use this route';
  if (_isPublicRoute(req.originalUrl, req.method) || (tc && tc.tokenOk)) {
    ret = next();
  } else if (tc && !tc.tokenOk) {
    msg = 'Token expired. Please login again!';
    logger.error(`${tc.error.name}: ${msg}`);
    error = {
      name: 'TOKEN_EXPIRED', message: msg, stack: '', type: ErrorType.TOKEN_EXPIRED
    };
    ret = res.status(401).send(error);
  } else {
    logger.error(msg);
    error = {
      name: 'UNAUTHORIZED', message: msg, stack: '', type: ErrorType.UNAUTHORIZED
    };
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
      } else if (route.url.includes(':id')) {
        const split = route.url.split(':id');
        if (url.startsWith(split[0]) && url.endsWith(split[1])) {
          isPublic = true;
        }
      } else if (url === route.url) {
        isPublic = true;
      }
    }
  });
  return isPublic;
}

/**
 * Checks if a route is allowed by cors to use with requests on backend side only (e.g. using postman)
 * @param url is the original url
 * @param method is the HTTP method
 */
function corsAllowedRoutes (url: string, method: string) {
  return (url.includes('orders') && url.includes('files')
    && method === 'GET') || url.includes('statistics')
    || (url.includes('users/login') && method === 'POST');
}

export default {
  jwtValid, corsAllowedRoutes
};
