import * as mongoose from 'mongoose';
import machineFields from './machine.basic.model';
import { laserTypeSchema } from '../lasertype.model';

const attributes = {
  ...machineFields(),
  laserTypes: [laserTypeSchema],
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
  maxResolution: {
    type: Number,
  },
  laserPower: {
    type: String
  },
  // old db fields
  comment: {
    type: String
  }
};

export const laserCutterSchema = mongoose.Schema(attributes);
export const Lasercutter = mongoose.model('Lasercutter', laserCutterSchema);

export default Lasercutter;
