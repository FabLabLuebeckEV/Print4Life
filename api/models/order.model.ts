import * as mongoose from 'mongoose';
import commentSchema from './comment.model';

const attributes = {
  comment: [commentSchema],
  editor: {
    type: String,
  }, // TODO: add user model
  owner: {
    type: String,
    required: true
  }, // TODO: add user model
  files: [{
    data: Buffer,
    contentType: String
  }],
  status: {
    enum : ['new', 'assigned', 'production', 'shipment', 'archived', 'representive'],
    type: String,
    default: 'new',
    required: true
  }, // TODO: add model
  token: {
    type: String,
    unique: false
  }
};

const orderSchema = mongoose.Schema(attributes);

export default orderSchema;
