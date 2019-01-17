import * as mongoose from 'mongoose';
import { iotEventSchema } from './iot-event.model';

const attributes = {
  clientId: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    required: true
  },
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    default: 'use-auth-token'
  },
  password: {
    type: String,
    required: true
  },
  events: {
    type: [iotEventSchema],
    required: true,
    default: undefined
  }
};

export const iotDeviceSchema = mongoose.Schema(attributes);

export const IoTDevice = mongoose.model('IoTDevice', iotDeviceSchema);

export default IoTDevice;
