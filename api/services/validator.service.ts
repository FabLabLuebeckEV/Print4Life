function checkId (id) {
  let retObj;
  if (id.length !== 24) {
    retObj = { status: 400, error: 'Id needs to be a 24 character long hex string!' };
  } else {
    retObj = undefined;
  }
  return retObj;
}

export default {
  checkId,
};
