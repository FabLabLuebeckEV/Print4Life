const machineFields = {
  fablabId: {
    type: String,
    required: true,
    minlength: 24,
    maxlength: 24
  },
  deviceName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['3d-printer', 'lasercutter', 'otherMachine', 'millingMachine'],
    required: true
  },
  manufacturer: {
    type: String
  },
  schedules: [], // id of schedules
  activated: {
    type: Boolean,
    required: true,
    default: true
  },
  informationLink: {
    type: String
  }
};

function getFields () {
  const object = {};
  Object.keys(machineFields).forEach((prop) => {
    object[prop] = machineFields[prop];
  });
  return object;
}

export const searchableTextFields = ['deviceName', 'manufacturer'];

export default getFields;
