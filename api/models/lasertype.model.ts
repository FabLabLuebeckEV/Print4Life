import * as mongoose from 'mongoose';

const attributes = {
  laserType: {
    type: String,
    required: true
  },
  // old db fields
  id: {
    type: Number
  },
};

const laserTypeSchema = mongoose.Schema(attributes);

export default laserTypeSchema;
