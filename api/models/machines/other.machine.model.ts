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

export const otherMachineSchema = mongoose.Schema(attributes);
export const Other = mongoose.model('OtherMachine', otherMachineSchema);

export default Other;
