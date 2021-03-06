import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
/* eslint-disable no-unused-vars */
import routerService, { ErrorType, IError } from './router.service';
/* eslint-enable no-unused-vars */

export interface TokenCheck {
  tokenOk: boolean;
  error: any;
  decoded: any;
}

function checkQuery (query: any, fields?: Array<String>) {
  if (!query) {
    return {};
  }
  if (query.$nor && query.$nor.length === 0) {
    delete query.$nor;
  }
  if (query.$or && query.$or.length === 0) {
    delete query.$or;
  }
  if (query.$and && query.$and.length === 0) {
    delete query.$and;
  }
  // if $text operator is used, use regex for partial word search and remove $text operator
  if (query.$and && query.$and.length && fields && fields.length) {
    let created = false;
    let found = false;
    let index;
    query.$and.forEach((elem, idx) => {
      if (elem.$text && elem.$text.$search) {
        found = true;
        if (!created) {
          index = idx;
          query.$and.push({ $or: [] });
          created = true;
        }
        fields.forEach((field) => {
          const obj = {};
          obj[`${field}`] = { $regex: elem.$text.$search, $options: 'i' };
          query.$and[query.$and.length - 1].$or.push(obj);
        });
      } else if (elem.$or && !elem.$or.length) {
        delete elem.$or;
      } else if (elem.$nor && !elem.$nor.length) {
        delete elem.$nor;
      }
    });
    if (found) {
      query.$and.splice(index, 1);
    }
  }
  return query;
}

function checkId (id: string): { status: number, error: IError } {
  let retObj;
  if (id) {
    const valid = mongoose.Types.ObjectId.isValid(id);
    if (!valid) {
      retObj = {
        status: 400,
        error: {
          name: 'MALFORMED_REQUEST',
          message: 'Malformed Id! Check if id is a 24 character long hex string!',
          type: ErrorType.MALFORMED_REQUEST
        }
      };
    } else {
      retObj = undefined;
    }
  } else {
    retObj = {
      status: 400,
      error: {
        name: 'MALFORMED_REQUEST',
        message: 'Malformed Id! Please provide a valid id!',
        type: ErrorType.MALFORMED_REQUEST
      }
    };
  }

  return retObj;
}

async function checkToken (req): Promise<TokenCheck> {
  let ret: TokenCheck;
  let token;
  let split;
  if (req.headers && req.headers.authorization) {
    split = req.headers.authorization.split('JWT');
    token = split && split.length > 1 ? split[1].trim() : undefined;
  } else if (routerService.corsAllowedRoutes(req.originalUrl, req.method) && req.query && req.query.token) {
    split = req.query.token.split('JWT');
    token = split && split.length > 1 ? split[1].trim() : undefined;
  }
  if (token) {
    try {
      const decoded = await jwt.verify(token, config.jwtSecret);
      ret = { tokenOk: true, error: undefined, decoded };
    } catch (error) {
      ret = { tokenOk: false, error, decoded: undefined };
    }
  }
  return ret;
}

function isAdmin (user: any): boolean {
  return user && user.role && user.role.role === 'admin';
}

export default {
  checkId,
  checkToken,
  checkQuery,
  isAdmin
};
