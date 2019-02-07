import * as mongoose from 'mongoose';

const attributes = {
  topic: {
    type: String,
    required: true
  },
  dataformat: {
    type: String,
    required: true,
    enum: ['json', 'bin', 'txt']
  }
};

export const iotEventSchema = mongoose.Schema(attributes, {
  _id: false,
  __v: false
});

export const IoTEvent = mongoose.model('IoTEvent', iotEventSchema);

export default IoTEvent;
