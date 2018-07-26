import * as mongoose from 'mongoose';
import machineFields from '../machine.basic.model';

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
  pictureURL: {
    type: String
  },
  comment: {
    type: String
  }
};

const millingMachineSchema = mongoose.Schema(attributes);

export default millingMachineSchema;
