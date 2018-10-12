import * as mongoose from 'mongoose';

import Fablab from '../models/fablab.model';

function get (id) {
  const _id = mongoose.Types.ObjectId(id);
  return Fablab.findOne({ _id });
}

function getAll () {
  return Fablab.find();
}

function create (params) {
  const fablab = new Fablab(params);
  return fablab.save();
}

function update (_id, params) {
  return Fablab.update(
    { _id },
    params,
    { upsert: true }).then(() => Fablab.findOne({ _id }));
}

async function deleteById (id) {
  const fablab = await get(id);
  fablab.activated = false;
  return update(id, fablab);
}

export default { get, getAll, create, update, deleteById };
