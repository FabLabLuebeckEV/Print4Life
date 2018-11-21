import * as mongoose from 'mongoose';
import { commentSchema } from './comment.model';
import { addressSchema } from './address.model';
import fileSchema from './file.model';

const attributes = {
  comments: [commentSchema],
  projectname: {
    type: String,
    required: true
  },
  editor: {
    type: String,
    minlength: 24,
    maxlength: 24
  },
  owner: {
    type: String,
    required: true,
    minlength: 24,
    maxlength: 24
  },
  files: [fileSchema],
  status: {
    enum: ['new', 'assigned', 'production', 'shipment', 'archived', 'representive', 'deleted'],
    type: String,
    default: 'new',
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  shippingAddress: addressSchema,
  createdAt: {
    type: Date,
    required: true
  },
  machine: {
    type: {
      type: String,
      required: true
    },
    _id: {
      type: String,
      required: true
    }
  }
};

export const orderSchema = mongoose.Schema(attributes);
export const Order = mongoose.model('Order', orderSchema);

export default Order;
