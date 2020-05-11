import * as mongoose from 'mongoose';
import addressSchema from './address.model';

const attributes = {
  name: { type: String, required: true },
  address: { type: addressSchema, required: true },
  activated: { type: Boolean, required: true, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  phone: {
    type: String,
  },
};

export const hospitalSchema = mongoose.Schema(attributes);
export const Hospital = mongoose.model('Hospital', hospitalSchema);
export const searchableTextFields = ['owner'];

export default Hospital;
