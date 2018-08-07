import { Printer } from '../models/machines/printer.model';
import { Other } from '../models/machines/other.machine.model';
import { MillingMachine } from '../models/machines/milling.machine.model';
import { LaserCutter } from '../models/machines/lasercutter.model';

/**
 * This method gets a specific type of machine (or all) and returns a promise with the results
 * type is the type of machine to get
 * @returns a promise with the results
 */
function getMachineType (type) {
  const promises = [];
  let obj;
  switch (type) {
    case 'printer':
      obj = [];
      promises.push(Printer.find());
      break;
    case 'lasercutter':
      obj = [];
      promises.push(LaserCutter.find());
      break;
    case 'otherMachine':
      obj = [];
      promises.push(Other.find());
      break;
    case 'millingMachine':
      obj = [];
      promises.push(MillingMachine.find());
      break;
    default:
      obj = {
        printers: [],
        lasercutters: [],
        millingMachines: [],
        otherMachines: []
      };
      promises.push(Printer.find());
      promises.push(LaserCutter.find());
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
 * type is the type of machine to get
 * params are the params of the machine
 * @returns a promise with the results
 */
function create (type, params) {
  if (!params.type) {
    params.type = type;
  }
  switch (type) {
    case 'printer':
      return (new Printer(params)).save();
    case 'lasercutter':
      return (new LaserCutter(params)).save();
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
 * type is the type of machine to get
 * _id is the id of the machine
 * @returns a promise with the results
 */
function deleteById (type, _id) {
  switch (type) {
    case 'printer':
      return Printer.deleteOne({ _id });
    case 'lasercutter':
      return LaserCutter.deleteOne({ _id });
    case 'otherMachine':
      return Other.deleteOne({ _id });
    case 'millingMachine':
      return MillingMachine.deleteOne({ _id });
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
    case 'printer':
      return Printer.findOne({ _id });
    case 'lasercutter':
      return LaserCutter.findOne({ _id });
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
 * type is the type of machine to get
 * _id is the id of the machine
 * machine is the machine with updated fields
 * @returns a promise with the result
 */
function update (type, _id, machine) {
  delete machine.__v;
  switch (type) {
    case 'printer':
      return Printer.update(
        { _id },
        machine,
        { upsert: true }).then(() => Printer.findOne({ _id }));
    case 'lasercutter':
      return LaserCutter.update(
        { _id },
        machine,
        { upsert: true }).then(() => LaserCutter.findOne({ _id }));
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

export default {
  getMachineType,
  create,
  deleteById,
  get,
  update
};
