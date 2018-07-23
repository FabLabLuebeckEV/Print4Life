import * as mongoose from 'mongoose';

const attributes = {
  content: {
    type: String
  },
  author: {
    type: String // TODO: add user model
  }
};

const commentSchema = mongoose.Schema(attributes);

export default commentSchema;
