import * as mongoose from 'mongoose';

import laserTypeSchema from '../models/lasertype.model';

const LaserTypes = mongoose.model('LasercutterLasertypes', laserTypeSchema);

function getLaserTypes () {
  return LaserTypes.find();
}

export default {
  getLaserTypes,
};
