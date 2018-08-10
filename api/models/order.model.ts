import * as mongoose from 'mongoose';
import { commentSchema } from './comment.model';

const attributes = {
  comments: [commentSchema],
  projectname: {
    type: String,
    required: true
  },
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
    enum: ['new', 'assigned', 'production', 'shipment', 'archived', 'representive', 'deleted'],
    type: String,
    default: 'new',
    required: true
  }, // TODO: add model
  token: {
    type: String,
    unique: true,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  machine: {
    type: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }
};

export const orderSchema = mongoose.Schema(attributes);
export const Order = mongoose.model('Order', orderSchema);

export default Order;
