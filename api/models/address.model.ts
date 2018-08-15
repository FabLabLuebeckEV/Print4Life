import * as mongoose from 'mongoose';

const attributes = {
  street: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
};

export const addressSchema = mongoose.Schema(attributes, { _id: false, __v: false });

export default addressSchema;
