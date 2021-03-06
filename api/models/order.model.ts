import * as mongoose from 'mongoose';
import { commentSchema } from './comment.model';
import { addressSchema } from './address.model';
import fileSchema from './file.model';

const attributes = {
  comments: [commentSchema],
  fablabId: {
    type: String
  },
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
    enum: ['open', 'in progress', 'closed'],
    type: String,
    default: 'open',
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
  shared: {
    type: Boolean,
    required: true,
    default: false
  },
  machine: {
    type: {
      type: String,
    },
    _id: {
      type: String
    },
    schedule: {
      id: {
        type: String
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      }
    }
  },
  fileCopyright: {
    type: Boolean,
    default: false
  },
  batch: {
    number: {
      type: Number
    },
    accepted: [{
      number: {
        type: Number
      },
      user: {
        type: String
      },
      status: {
        type: String
      }
    }],
    finished: [{
      number: {
        type: Number
      },
      user: {
        type: String
      },
      status: {
        type: String
      }
    }]
  },
  blueprintId: {
    type: String,
    minlength: 24,
    maxlength: 24
  },
  thankyouText: {
    type: String,
    required: true
  }
};

export const orderSchema = mongoose.Schema(attributes);
export const Order = mongoose.model('Order', orderSchema);
export const searchableTextFields = ['projectname'];

export default Order;
