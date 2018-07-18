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

const lasercutterCanLaserTypesSchema = mongoose.Schema(attributes);

export default lasercutterCanLaserTypesSchema;
