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

const printerMaterialSchema = mongoose.Schema(attributes, { _id: false });

export default printerMaterialSchema;
