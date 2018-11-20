import * as mongoose from 'mongoose';

const attributes = {
  contentType: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  deprecated: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    required: true
  }
};

export const fileSchema = mongoose.Schema(attributes, { _id: false, __v: false });

export default fileSchema;
