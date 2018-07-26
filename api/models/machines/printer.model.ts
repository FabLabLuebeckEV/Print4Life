import * as mongoose from 'mongoose';
import machineFields from '../machine.basic.model';
import printerMaterialSchema from '../printerMaterial.model';

const attributes = {
  ...machineFields(),
  materials: [printerMaterialSchema],
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

const printerSchema = mongoose.Schema(attributes);

export default printerSchema;
