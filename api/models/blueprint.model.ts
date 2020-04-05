import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { materialSchema } from './material.model';

const { Schema } = { Schema: mongoose.Schema };

export const searchableTextFields = ['username', 'firstname', 'lastname', 'email'];

export const blueprintSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  manual: {
    type: String,
    required: true
  },
  materials: materialSchema
});

export const Blueprint = mongoose.model('Blueprint', blueprintSchema);

export default Blueprint;
