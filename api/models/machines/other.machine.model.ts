import * as mongoose from 'mongoose';
import machineFields from './machine.basic.model';

const attributes = {
  ...machineFields(),
  typeOfMachine: {
    type: String,
    required: true
  },
  // old db fields
  pictureURL: {
    type: String
  },
  comment: {
    type: String
  }
};

const otherMachineSchema = mongoose.Schema(attributes);

export default otherMachineSchema;
