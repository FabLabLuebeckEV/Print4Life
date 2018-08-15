import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const attributes = new Schema({
  role: {
    enum: ['guest', 'user', 'editor', 'admin'],
    type: String,
    default: 'guest',
    required: true
  },
}, {
  _id: false,
  __v: false
});

export const roleSchema = mongoose.Schema(attributes);
export const Role = mongoose.model('Address', roleSchema);

export default Role;
