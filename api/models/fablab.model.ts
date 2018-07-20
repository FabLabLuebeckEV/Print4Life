import * as mongoose from 'mongoose';

const attributes = {
  fid: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
  },
  mail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
};

const printerMaterialSchema = mongoose.Schema(attributes);

export default printerMaterialSchema;
