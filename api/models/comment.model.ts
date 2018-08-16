import * as mongoose from 'mongoose';

const attributes = {
  content: {
    type: String,
    required: true
  },
  author: {
    type: String, // TODO: add user model
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
};

export const commentSchema = mongoose.Schema(attributes);
export const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
