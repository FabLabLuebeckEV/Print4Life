import * as mongoose from 'mongoose';

const attributes = {
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

export const fablabSchema = mongoose.Schema(attributes);
export const Fablab = mongoose.model('Fablab', fablabSchema);

export default Fablab;
