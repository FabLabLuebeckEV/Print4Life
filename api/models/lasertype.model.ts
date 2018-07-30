import * as mongoose from 'mongoose';

const attributes = {
  laserType: {
    type: String,
    required: true
  }
};

export const laserTypeSchema = mongoose.Schema(attributes);
export const LaserType = mongoose.model('LasercutterLasertypes', laserTypeSchema);

export default LaserType;
