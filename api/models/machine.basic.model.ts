const machineFields = {
  fablabId: {
    type: Number,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String
  },
  // old db fields
  id: {
    type: Number
  },
  fid: {
    type: Number
  }
};

function getFields () {
  const object = {};
  Object.keys(machineFields).forEach((prop) => {
    object[prop] = machineFields[prop];
  });
  return object;
}

export default getFields;
