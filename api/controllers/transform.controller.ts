import * as mongoose from 'mongoose';

import logger from '../logger';
import printerSchema from '../models/printer.model';
import printerMaterialSchema from '../models/printerMaterial.model';
import printerCanMaterialSchema from '../models/printerCanMaterial.model';
import otherMachineSchema from '../models/other.machine.model';
import millingMachineSchema from '../models/milling.machine.model';
import laserTypeSchema from '../models/lasertype.model';
import laserCutterSchema from '../models/lasercutter.model';
import lasercutterCanLaserTypesSchema from '../models/laserCanTypes.model';

const oldPrinter = mongoose.model('Printer', printerSchema);
const Printer = mongoose.model('Printer', printerSchema);
const PrinterMaterial = mongoose.model('PrinterMaterial', printerMaterialSchema);
const PrinterCanMaterial = mongoose.model('PrinterCanMaterial', printerCanMaterialSchema);
const Material = mongoose.model('Material', printerMaterialSchema);

const oldOther = mongoose.model('OtherMachine', otherMachineSchema);
const Other = mongoose.model('OtherMachine', otherMachineSchema);

const oldMillingMachine = mongoose.model('MillingMachine', millingMachineSchema);
const MillingMachine = mongoose.model('MillingMachine', millingMachineSchema);

const LaserCutter = mongoose.model('Lasercutter', laserCutterSchema);
const LaserType = mongoose.model('Lasercutterlasertype', laserTypeSchema);
const LasercutterCanLaserTypes = mongoose.model('LaserCutterCanLaserTypes', lasercutterCanLaserTypesSchema);

function transformMillingMachine () {
  const props = Object.keys(millingMachineSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return oldMillingMachine.find((err, oldMillingMachines) => {
    if (err) return err;
    else if (oldMillingMachines) {
      const machines = [];
      return MillingMachine.deleteMany({}, (err, deleted) => {
        if (err) return err;
        else if (deleted) {
          oldMillingMachines.forEach((millingMachine) => {
            if (millingMachine.fid) {
              millingMachine.fablabId = millingMachine.fid;
            }
            const newObject = { fablabId: millingMachine.fid, ..._getCleanObject(millingMachine, props) };
            const newMachine = new MillingMachine(newObject);
            newMachine.save();
            machines.push(newMachine);
          });
          return machines;
        }
        return [];
      }).catch((err) => { logger.error(err); });
    }
    return [];
  }).catch((err) => { logger.error(err); });
}

function transformOthers () {
  const props = Object.keys(otherMachineSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return oldOther.find((err, oldOthers) => {
    if (err) return err;
    else if (oldOthers) {
      const machines = [];
      return Other.deleteMany({}, (err, deleted) => {
        if (err) return err;
        else if (deleted) {
          oldOthers.forEach((oldOther) => {
            if (oldOther.fid) {
              oldOther.fablabId = oldOther.fid;
            }
            const newObject = { fablabId: oldOther.fid, ..._getCleanObject(oldOther, props) };
            const newMachine = new Other(newObject);
            newMachine.save();
            machines.push(newMachine);
          });
          return machines;
        }
        return [];
      }).catch((err) => { logger.error(err); });
    }
    return [];
  }).catch((err) => { logger.error(err); });
}

function transformLaserTypes () {
  return LaserType.find((err, laserTypes) => {
    if (err) return logger.error(err);
    else if (laserTypes) {
      return LaserType.deleteMany({}, (err, deleted) => {
        if (err) return err;
        else if (deleted) {
          const newLaserTypes = [];
          laserTypes.forEach((material) => {
            const newLaserType = new LaserType({ laserType: material.laserType, id: material.id });
            newLaserType.save();
            newLaserTypes.push(newLaserType);
          });
          return laserTypes;
        }
        return [];
      }).catch((err) => { logger.error(err); });
    }
    return [];
  }).catch((err) => { logger.error(err); });
}

function transformLaserCutters () {
  const props = Object.keys(laserCutterSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return LaserCutter.find((err, laserCutters) => {
    if (err) return err;
    else if (laserCutters) {
      LaserType.find((err, laserTypes) => {
        if (err) return err;
        else if (laserTypes) {
          return LasercutterCanLaserTypes.find((err, canLaserTypes) => {
            if (err) return err;
            else if (canLaserTypes) {
              const machines = [];
              return LaserCutter.deleteMany({}, (err, deleted) => {
                if (err) return err;
                else if (deleted) {
                  laserCutters.forEach((laserCutter) => {
                    if (laserCutter.fid) {
                      laserCutter.fablabId = laserCutter.fid;
                    }
                    laserCutter.laserTypes = [];
                    canLaserTypes.forEach((laserType) => {
                      if (laserCutter.id === laserType.laserCutterId) {
                        const laserTypeAdd = _find(laserTypes, laserType.laserTypeId, laserTypeSchema);
                        if (laserTypeAdd) {
                          laserCutter.laserTypes.push(laserTypeAdd);
                        }
                      }
                    });
                    const newObject = { fablabId: laserCutter.fid, ..._getCleanObject(laserCutter, props) };
                    const newMachine = new LaserCutter(newObject);
                    newMachine.save();
                    machines.push(newMachine);
                  });
                  return machines;
                }
                return [];
              }).catch((err) => { logger.error(err); });
            }
            return [];
          }).catch((err) => { logger.error(err); });
        }
        return [];
      }).catch((err) => { logger.error(err); });
    }
    return [];
  }).catch((err) => { logger.error(err); });
}

function transformPrinterMaterial () {
  return Material.deleteMany({ type: 'printerMaterial' }, (err, deleted) => {
    if (err) return err;
    else if (deleted) {
      return PrinterMaterial.find((err, materials) => {
        if (err) return logger.error(err);
        else if (materials) {
          const newMaterials = [];
          materials.forEach((material) => {
            const newMaterial = new Material({ material: material.material, id: material.id, type: 'printerMaterial' });
            newMaterial.save();
            newMaterials.push(newMaterial);
          });
          return materials;
        }
        return [];
      }).catch((err) => { logger.error(err); });
    }
    return [];
  }).catch((err) => { logger.error(err); });
}

function transformPrinters () {
  const props = Object.keys(printerSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return oldPrinter.find((err, printers) => {
    if (err) return err;
    else if (printers) {
      Material.find((err, materials) => {
        if (err) return err;
        else if (materials) {
          return PrinterCanMaterial.find((err, canMaterials) => {
            if (err) return err;
            else if (canMaterials) {
              const machines = [];
              return Printer.deleteMany({}, (err, deleted) => {
                if (err) return err;
                else if (deleted) {
                  printers.forEach((printer) => {
                    if (printer.fid) {
                      printer.fablabId = printer.fid;
                    }
                    printer.materials = [];
                    canMaterials.forEach((material) => {
                      if (printer.id === material.printerId) {
                        const materialAdd = _find(materials, material.materialId, printerMaterialSchema);
                        if (materialAdd) {
                          printer.materials.push(materialAdd);
                        }
                      }
                    });
                    const newObject = { fablabId: printer.fid, ..._getCleanObject(printer, props) };
                    const newPrinter = new Printer(newObject);
                    newPrinter.save();
                    machines.push(newPrinter);
                  });
                  return machines;
                }
                return [];
              }).catch((err) => { logger.error(err); });
            }
            return [];
          }).catch((err) => { logger.error(err); });
        }
        return [];
      }).catch((err) => { logger.error(err); });
    }
    return [];
  }).catch((err) => { logger.error(err); });
}

function cleanDocuments () {
  return Promise.all([
    Material.find((err, materials) => {
      if (err) return err;
      else if (materials) {
        materials.forEach((material) => {
          material.id = undefined;
          material.save();
        });
        return materials;
      }
      return [];
    }).catch((err) => { logger.error(err); }),
    Printer.find((err, printers) => {
      if (err) return err;
      else if (printers) {
        printers.forEach((Printer) => {
          Printer.id = undefined;
          Printer.pictureURL = undefined;
          Printer.fid = undefined;
          Printer.save();
        });
        return { printers };
      }
      return [];
    }).catch((err) => { logger.error(err); }),
    MillingMachine.find((err, millingMachines) => {
      if (err) return err;
      else if (millingMachines) {
        millingMachines.forEach((millingMachine) => {
          millingMachine.id = undefined;
          millingMachine.pictureURL = undefined;
          millingMachine.fid = undefined;
          millingMachine.save();
        });
        return { millingMachines };
      }
      return [];
    }).catch((err) => { logger.error(err); }),
    LaserType.find((err, laserTypes) => {
      if (err) return err;
      else if (laserTypes) {
        laserTypes.forEach((laserType) => {
          laserType.id = undefined;
          laserType.save();
        });
        return laserTypes;
      }
      return [];
    }).catch((err) => { logger.error(err); }),
    LaserCutter.find((err, laserCutters) => {
      if (err) return err;
      else if (laserCutters) {
        laserCutters.forEach((laserCutter) => {
          laserCutter.id = undefined;
          laserCutter.pictureURL = undefined;
          laserCutter.fid = undefined;
          laserCutter.save();
        });
        return { laserCutters };
      }
      return [];
    }).catch((err) => { logger.error(err); }),
    Other.find((err, others) => {
      if (err) return err;
      else if (others) {
        others.forEach((other) => {
          other.id = undefined;
          other.pictureURL = undefined;
          other.fid = undefined;
          other.save();
        });
        return { others };
      }
      return [];
    }).catch((err) => { logger.error(err); })
  ]);
}

function _find (materials, id, schema) {
  const filteredMaterials = materials.filter((elem) => elem.id === id);
  let material;
  filteredMaterials.length > 0 ? material = filteredMaterials[0] : material = undefined;
  if (material) {
    const props = Object.keys(schema.paths)
      .filter((prop) => prop !== '_id' && prop !== '__v');
    return _getCleanObject(material, props);
  }
  return undefined;
}

/**
  {Object} source is the original object of the db
  {Array} props are the properties based on the schema of the source object
  {Object} the source object without the database fields like '__v' and '_id'
   */
function _getCleanObject (source, props) {
  const newObject = {};
  props.forEach((prop) => {
    newObject[prop] = source[prop];
  });
  return newObject;
}

export default {
  transformPrinterMaterial,
  transformPrinters,
  cleanDocuments,
  transformOthers,
  transformMillingMachine,
  transformLaserTypes,
  transformLaserCutters
};
