import * as mongoose from 'mongoose';
import addressSchema from './address.model';

const attributes = {
  name: {
    type: String,
    required: true
  },
  address: {
    type: addressSchema,
    required: true
  },
  activated: {
    type: Boolean,
    required: true,
    default: true
  }
};

export const fablabSchema = mongoose.Schema(attributes);
export const Fablab = mongoose.model('Fablab', fablabSchema);

export default Fablab;
