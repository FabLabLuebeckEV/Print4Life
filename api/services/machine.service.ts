import * as mongoose from 'mongoose';

import printerSchema from '../models/printer.model';
import otherMachineSchema from '../models/other.machine.model';
import millingMachineSchema from '../models/milling.machine.model';
import laserCutterSchema from '../models/lasercutter.model';

const Printer = mongoose.model('Printer', printerSchema);
const Other = mongoose.model('OtherMachine', otherMachineSchema);
const MillingMachine = mongoose.model('MillingMachine', millingMachineSchema);

const LaserCutter = mongoose.model('Lasercutter', laserCutterSchema);

/**
 * This method gets a specific type of machine (or all) and returns a promis with the results
 * type is the type of machine to get
 * @returns a promise with the results
 */
function getMachineType (type) {
  const promises = [];
  let obj;
  switch (type) {
    case 'Printer':
      obj = [];
      promises.push(Printer.find());
      break;
    case 'Lasercutter':
      obj = [];
      promises.push(LaserCutter.find());
      break;
    case 'OtherMachine':
      obj = [];
      promises.push(Other.find());
      break;
    case 'MillingMachine':
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

function create (type, params) {
  switch (type) {
    case 'Printer':
      return (new Printer(params)).save();
    case 'Lasercutter':
      return (new LaserCutter(params)).save();
    case 'OtherMachine':
      return (new Other(params)).save();
    case 'MillingMachine':
      return (new MillingMachine(params)).save();
    default:
      return Promise.reject('Machine Type not supported!');
  }
}

export default {
  getMachineType,
  create
};
