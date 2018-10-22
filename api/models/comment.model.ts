import * as mongoose from 'mongoose';

const attributes = {
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    minlength: 24,
    maxlength: 24
  },
  createdAt: {
    type: Date,
    required: true
  }
};

export const commentSchema = mongoose.Schema(attributes);
export const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
