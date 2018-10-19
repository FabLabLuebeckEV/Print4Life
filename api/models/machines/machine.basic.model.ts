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
  }
};

function getFields() {
  const object = {};
  Object.keys(machineFields).forEach((prop) => {
    object[prop] = machineFields[prop];
  });
  return object;
}

export default getFields;
