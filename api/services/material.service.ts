import * as mongoose from 'mongoose';

import materialSchema from '../models/material.model';

const Material = mongoose.model('Material', materialSchema);

function getMaterialByType (type) {
  return Material.find({ type });
}

export default {
  getMaterialByType,
};
