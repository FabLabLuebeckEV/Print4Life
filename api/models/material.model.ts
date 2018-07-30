import * as mongoose from 'mongoose';

const attributes = {
  material: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
};

export const materialSchema = mongoose.Schema(attributes);
export const Material = mongoose.model('Material', materialSchema);

export default Material;
