import * as mongoose from 'mongoose';

const attributes = {
  token: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    required: true
  }
};

export const jwtSchema = mongoose.Schema(attributes, { _id: false, __v: false });

export const JWT = mongoose.model('JWT', jwtSchema);

export default JWT;
