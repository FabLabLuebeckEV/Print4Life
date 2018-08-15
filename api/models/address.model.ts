import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const attributes = new Schema({
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
}, {
  _id: false,
  __v: false
});

export const addressSchema = mongoose.Schema(attributes);
export const Address = mongoose.model('Address', addressSchema);

export default Address;
