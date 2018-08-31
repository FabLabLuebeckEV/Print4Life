import * as mongoose from 'mongoose';

const attributes = {
  createdAt: {
    type: Date,
    required: true
  },
  token: {
    type: String,
    required: true
  },
};

export const jwtSchema = mongoose.Schema(attributes);
export const JwtModel = mongoose.model('Jwt', jwtSchema);

export default JwtModel;
