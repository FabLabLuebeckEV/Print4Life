import { Printer3D } from '../models/machines/3d-printer.model';
import { Other } from '../models/machines/other.machine.model';
import { MillingMachine } from '../models/machines/milling.machine.model';
import { Lasercutter } from '../models/machines/lasercutter.model';

/**
 * This method gets a specific type of machine (or all) and returns a promise with the results
 * type is the type of machine to get
 * limit is the number of items to get
 * skip is the number of items to skip
 * @returns a promise with the results
 */
function getMachineType (type: String, limit?: Number, skip?: Number) {
  const promises = [];
  let obj;
  switch (type) {
    case '3d-printer':
      obj = [];
      if (limit >= 0 && skip >= 0) {
        promises.push(Printer3D.find().limit(limit).skip(skip));
      } else {
        promises.push(Printer3D.find());
      }
      break;
    case 'lasercutter':
      obj = [];
      if (limit >= 0 && skip >= 0) {
        promises.push(Lasercutter.find().limit(limit).skip(skip));
      } else {
        promises.push(Lasercutter.find());
      }
      break;
    case 'otherMachine':
      obj = [];
      if (limit >= 0 && skip >= 0) {
        promises.push(Other.find().limit(limit).skip(skip));
      } else {
        promises.push(Other.find());
      }
      break;
    case 'millingMachine':
      obj = [];
      if (limit >= 0 && skip >= 0) {
        promises.push(MillingMachine.find().limit(limit).skip(skip));
      } else {
        promises.push(MillingMachine.find());
      }
      break;
    default:
      obj = {
        printers3d: [],
        lasercutters: [],
        millingMachines: [],
        otherMachines: []
      };
      promises.push(Printer3D.find());
      promises.push(Lasercutter.find());
      promises.push(Other.find());
      promises.push(MillingMachine.find());
      break;
  }
  return Promise.all(promises).then((results) => {
    if (results) {
      results.forEach((machines) => {
        machines.forEach((machine) => {
          if (Array.isArray(obj)) {
            obj.push(machine);
          } else {
            Object.keys(obj).forEach((type) => {
              if (type.startsWith(machine.type)) {
                obj[type].push(machine);
              }
            });
          }
        });
      });
      return obj;
    }
    return [];
  });
}

/**
 * This method creates a specific type of machine and returns a promise with the results
 * type is the type of machine to create
 * params are the params of the machine
 * @returns a promise with the results
 */
function create (type, params) {
  if (!params.type) {
    params.type = type;
  }
  switch (type) {
    case '3d-printer':
      return (new Printer3D(params)).save();
    case 'lasercutter':
      return (new Lasercutter(params)).save();
    case 'otherMachine':
      return (new Other(params)).save();
    case 'millingMachine':
      return (new MillingMachine(params)).save();
    default:
      return Promise.reject('Machine Type not supported!');
  }
}

/**
 * This method deletes a specific type of machine by a given id and returns a promise with the success or failure
 * type is the type of machine to delete
 * _id is the id of the machine
 * @returns a promise with the results
 */
async function deleteById (type, _id) {
  switch (type) {
    case '3d-printer':
      return Printer3D.updateOne({ _id, activated: !(await Printer3D.findOne({ _id })).activated });
    case 'lasercutter':
      const old2 = (await Printer3D.updateOne({ _id })).activated;
      return Lasercutter.updateOne({ _id, activated: !(await Lasercutter.findOne({ _id })).activated });
    case 'otherMachine':
      return Other.updateOne({ _id, activated: !(await Other.findOne({ _id })).activated });
    case 'millingMachine':
      return MillingMachine.updateOne({ _id, activated: !(await MillingMachine.findOne({ _id })).activated });
    default:
      return Promise.reject('Machine Type not supported!');
  }
}

/**
 * This method gets a specific type of machine by a given id and returns a promise with the result
 * type is the type of machine to get
 * _id is the id of the machine
 * @returns a promise with the results
 */
function get (type, _id) {
  switch (type) {
    case '3d-printer':
      return Printer3D.findOne({ _id });
    case 'lasercutter':
      return Lasercutter.findOne({ _id });
    case 'otherMachine':
      return Other.findOne({ _id });
    case 'millingMachine':
      return MillingMachine.findOne({ _id });
    default:
      return Promise.reject('Machine Type not supported!');
  }
}

/**
 * This method updates a specific type of machine by a given id and returns a promise with the result
 * type is the type of machine to update
 * _id is the id of the machine
 * machine is the machine with updated fields
 * @returns a promise with the result
 */
function update (type, _id, machine) {
  delete machine.__v;
  switch (type) {
    case '3d-printer':
      return Printer3D.update(
        { _id },
        machine,
        { upsert: true }).then(() => Printer3D.findOne({ _id }));
    case 'lasercutter':
      return Lasercutter.update(
        { _id },
        machine,
        { upsert: true }).then(() => Lasercutter.findOne({ _id }));
    case 'otherMachine':
      return Other.update(
        { _id },
        machine,
        { upsert: true }).then(() => Other.findOne({ _id }));
    case 'millingMachine':
      return MillingMachine.update(
        { _id },
        machine,
        { upsert: true }).then(() => MillingMachine.findOne({ _id }));
    default:
      return Promise.reject('Machine Type not supported!');
  }
}

/**
 * This method counts a specific type of machine returns a promise with the result
 * type is the type of machine to count
 * @returns a promise with the result
 */
function count (type) {
  switch (type) {
    case '3d-printer':
      return Printer3D.countDocuments();
    case 'lasercutter':
      return Lasercutter.countDocuments();
    case 'otherMachine':
      return Other.countDocuments();
    case 'millingMachine':
      return MillingMachine.countDocuments();
    default:
      return Promise.reject('Machine Type not supported!');
  }
}

export default {
  getMachineType,
  create,
  deleteById,
  get,
  update,
  count
};
