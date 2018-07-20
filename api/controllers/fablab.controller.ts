import * as mongoose from 'mongoose';

import fablabSchema from '../models/fablab.model';

const Fablab = mongoose.model('Fablab', fablabSchema);

function getFablab (id) {
  return Fablab.findOne({ fid: id });
}

export default { getFablab };
