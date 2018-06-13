import * as mongoose from 'mongoose';

const helloWorldSchema = mongoose.Schema({
  message: {
    type: String,
    required: true
  },
});

export default helloWorldSchema;
