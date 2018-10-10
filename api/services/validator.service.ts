import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

/* eslint-disable no-undef */
export interface TokenCheck {
  tokenOk: boolean;
  error: any;
  decoded: any;
}
/* eslint-enable no-undef */

function checkId (id: string) {
  let retObj;
  const valid = mongoose.Types.ObjectId.isValid(id);
  if (!valid) {
    retObj = { status: 400, error: 'Malformed Id! Check if id is a 24 character long hex string!' };
  } else {
    retObj = undefined;
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
    if (token) {
      try {
        const decoded = await jwt.verify(token, config.jwtSecret);
        ret = { tokenOk: true, error: undefined, decoded };
      } catch (error) {
        ret = { tokenOk: false, error, decoded: undefined };
      }
    }
  }
  return ret;
}

export default {
  checkId,
  checkToken
};
