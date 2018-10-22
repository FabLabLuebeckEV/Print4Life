import * as mongoose from 'mongoose';
import machineFields from './machine.basic.model';

const attributes = {
  ...machineFields(),
  camSoftware: {
    type: String
  },
  workspaceX: {
    type: Number
  },
  workspaceY: {
    type: Number
  },
  workspaceZ: {
    type: Number
  },
  movementSpeed: {
    type: Number
  },
  stepSize: {
    type: Number
  },
  // old db fields
  comment: {
    type: String
  }
};

export const millingMachineSchema = mongoose.Schema(attributes);
export const MillingMachine = mongoose.model('MillingMachine', millingMachineSchema);

export default MillingMachine;
