import * as mongoose from 'mongoose';

const printerSchema = mongoose.model(
  'Printer', mongoose.Schema({
    id: {
      type: Number,
      required: true
    },
    fid: {
      type: Number,
      required: true
    },
    deviceName: {
      type: String,
      required: true
    },
    manufacturer: {
      type: String,
      required: true
    },
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
    pictureURL: {
      type: String
    },
    comment: {
      type: String
    }
  })
);

export default printerSchema;
