import * as mongoose from 'mongoose';

const attributes = {
  laserType: {
    type: String,
    required: true
  }
};

const laserTypeSchema = mongoose.Schema(attributes, { _id: false });

export default laserTypeSchema;
