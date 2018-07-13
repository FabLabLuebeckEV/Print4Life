import * as mongoose from 'mongoose';

const attributes = {
  printerId: {
    type: Number,
    required: true
  },
  materialId: {
    type: Number,
    required: true
  },
};

const printerMaterialSchema = mongoose.Schema(attributes);

export default printerMaterialSchema;
