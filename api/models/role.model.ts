import * as mongoose from 'mongoose';

const attributes = {
  role: {
    enum: ['guest', 'user', 'editor', 'admin'],
    type: String,
    default: 'guest',
    required: true
  },
};

export const roleSchema = mongoose.Schema(attributes, {
  _id: false,
  __v: false
});

export const Role = mongoose.model('Role', roleSchema);

export default Role;
