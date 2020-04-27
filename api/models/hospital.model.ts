import * as mongoose from 'mongoose';
import addressSchema from './address.model';

const attributes = {
  name: { type: String, required: true },
  address: { type: addressSchema, required: true },
  activated: { type: Boolean, required: true, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  hospitalNumber: { type: String, required: true }
};

export const hospitalSchema = mongoose.Schema(attributes);
export const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;