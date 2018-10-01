import * as mongoose from 'mongoose';
import { User } from '../models/user.model';
import config from '../config/config';

function checkId (id) {
  let retObj;
  const valid = mongoose.Types.ObjectId.isValid(id);
  if (!valid) {
    retObj = { status: 400, error: 'Malformed Id! Check if id is a 24 character long hex string!' };
  } else {
    retObj = undefined;
  }
  return retObj;
}

async function checkToken (req): Promise<Boolean> {
  let ret = false;
  let token;
  let split;
  if (req.headers && req.headers.authorization) {
    split = req.headers.authorization.split('JWT');
    token = split && split.length > 1 ? split[1].trim() : undefined;
    if (token) {
      const user = await User.findOne({ 'jwt.token': token });
      if (user && user.jwt.issuedAt) {
        const today = new Date();
        const diff = today.valueOf() - user.jwt.issuedAt.valueOf();
        if (diff < config.jwtExpiryTime) {
          ret = true;
        }
      }
    }
  }
  return ret;
}

export default {
  checkId,
  checkToken
};
