import * as mongoose from 'mongoose';

const attributes = {
  language: {
    enum: ['de', 'da', 'en'],
    type: String,
    default: 'en'
  },
};

export const languageSchema = mongoose.Schema(attributes, {
  _id: false,
  __v: false
});

export const Language = mongoose.model('Language', languageSchema);

export default Language;
