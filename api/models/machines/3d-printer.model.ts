import * as mongoose from 'mongoose';
import machineFields from './machine.basic.model';
import { materialSchema } from '../material.model';

const attributes = {
  ...machineFields(),
  materials: [materialSchema],
  camSoftware: {
    type: String
  },
  printVolumeX: {
    type: Number
  },
  printVolumeY: {
    type: Number
  },
  printVolumeZ: {
    type: Number
  },
  printResolutionX: {
    type: Number,
  },
  printResolutionY: {
    type: Number,
  },
  printResolutionZ: {
    type: Number,
  },
  nozzleDiameter: {
    type: Number,
  },
  numberOfExtruders: {
    type: Number
  },
  // old db fields
  comment: {
    type: String
  }
};

export const printer3DSchema = mongoose.Schema(attributes);
export const Printer3D = mongoose.model('3DPrinter', printer3DSchema);

export default Printer3D;
