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
  pictureURL: {
    type: String
  },
  comment: {
    type: String
  }
};

export const printerSchema = mongoose.Schema(attributes);
export const Printer = mongoose.model('Printer', printerSchema);

export default Printer;
