import * as mongoose from 'mongoose';

const attributes = {
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  fablabId: {
    type: String,
    required: true
  },
  machine: {
    type: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  orderId: {
    type: String,
    required: true
  }
};

export const scheduleSchema = mongoose.Schema(attributes);

export const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
