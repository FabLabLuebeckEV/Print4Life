import * as mongoose from 'mongoose';

const attributes = {
  language: {
    enum: ['de', 'dk', 'en'],
    type: String,
    default: 'en',
    required: true
  },
};

export const languageSchema = mongoose.Schema(attributes, {
  _id: false,
  __v: false
});

export const Language = mongoose.model('Language', languageSchema);

export default Language;
