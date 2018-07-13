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
  // old db fields
  id: {
    type: Number
  },
};

const printerMaterialSchema = mongoose.Schema(attributes);

export default printerMaterialSchema;
