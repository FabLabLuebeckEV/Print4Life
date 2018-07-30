import * as mongoose from 'mongoose';

const attributes = {
  // old db fields
  id: {
    type: Number
  },
  laserCutterId: {
    type: Number
  },
  laserTypeId: {
    type: Number
  }
};

export const lasercutterCanLaserTypesSchema = mongoose.Schema(attributes);
export const LasercutterCanLaserTypes = mongoose.model('LaserCutterCanLaserTypes', lasercutterCanLaserTypesSchema);

export default LasercutterCanLaserTypes;
