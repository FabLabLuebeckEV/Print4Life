import * as mongoose from 'mongoose';

const attributes = {
  id: {
    type: Number
  },
  material: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
};

const printerMaterialSchema = mongoose.Schema(attributes);

export default printerMaterialSchema;
