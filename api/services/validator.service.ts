import * as mongoose from 'mongoose';

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

function checkToken (req): Boolean {
  let ret = false;
  let token;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split('Bearer')[1].trim();
    ret = !!token;
  }
  return ret;
}

export default {
  checkId,
  checkToken
};
