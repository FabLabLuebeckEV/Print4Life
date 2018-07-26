import * as mongoose from 'mongoose';

import logger from '../logger';
import printerSchema from '../models/machines/printer.model';
import materialSchema from '../models/material.model';
import printerCanMaterialSchema from '../models/printerCanMaterial.model';
import otherMachineSchema from '../models/machines/other.machine.model';
import millingMachineSchema from '../models/machines/milling.machine.model';
import laserTypeSchema from '../models/lasertype.model';
import laserCutterSchema from '../models/machines/lasercutter.model';
import lasercutterCanLaserTypesSchema from '../models/laserCanTypes.model';

const oldPrinter = mongoose.model('Printer', printerSchema);
const Printer = mongoose.model('Printer', printerSchema);
const PrinterMaterial = mongoose.model('PrinterMaterial', materialSchema);
const PrinterCanMaterial = mongoose.model('PrinterCanMaterial', printerCanMaterialSchema);
const Material = mongoose.model('Material', materialSchema);

const oldOther = mongoose.model('OtherMachine', otherMachineSchema);
const Other = mongoose.model('OtherMachine', otherMachineSchema);

const oldMillingMachine = mongoose.model('MillingMachine', millingMachineSchema);
const MillingMachine = mongoose.model('MillingMachine', millingMachineSchema);

const LaserCutter = mongoose.model('Lasercutter', laserCutterSchema);
const LaserType = mongoose.model('Lasercutterlasertype', laserTypeSchema);
const LasercutterCanLaserTypes = mongoose.model('LaserCutterCanLaserTypes', lasercutterCanLaserTypesSchema);

/**
 * @api {get} /api/v1/transform/milling Transform old milling machine db data to the current schema
 * @apiName Transform Milling Machines
 * @apiVersion 1.0.0
 * @apiGroup Transform
 *
 * @apiSuccess {String} msg a short message that everything went well
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*    {"msg":"Transformation of milling machines done"}
 */
function transformMillingMachine () {
  const props = Object.keys(millingMachineSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return oldMillingMachine.find((err, oldMillingMachines) => {
    if (err) {
      return err;
    } else if (oldMillingMachines) {
      const machines = [];
      return MillingMachine.deleteMany({}, (err, deleted) => {
        if (err) { return err; } else if (deleted) {
          oldMillingMachines.forEach((millingMachine) => {
            if (millingMachine.fid) {
              millingMachine.fablabId = millingMachine.fid;
            }
            const newObject = {
              fablabId: millingMachine.fid,
              type: undefined,
              ..._getCleanObject(millingMachine, props)
            };
            newObject.type = 'millingMachine';
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

/**
 * @api {get} /api/v1/transform/other Transform old other machine db data to the current schema
 * @apiName Transform Other Machines
 * @apiVersion 1.0.0
 * @apiGroup Transform
 *
 * @apiSuccess {String} msg a short message that everything went well
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*    {"msg":"Transformation of other machines done"}
 */
function transformOthers () {
  const props = Object.keys(otherMachineSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return oldOther.find((err, oldOthers) => {
    if (err) { return err; } else if (oldOthers) {
      const machines = [];
      return Other.deleteMany({}, (err, deleted) => {
        if (err) { return err; } else if (deleted) {
          oldOthers.forEach((oldOther) => {
            if (oldOther.fid) {
              oldOther.fablabId = oldOther.fid;
            }
            const newObject = {
              fablabId: oldOther.fid,
              type: undefined,
              ..._getCleanObject(oldOther, props)
            };
            newObject.type = 'otherMachine';
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

/**
 * Function to transform laser types needed for the laser cutter
 */
function transformLaserTypes () {
  return LaserType.find((err, laserTypes) => {
    if (err) { return logger.error(err); } else if (laserTypes) {
      return LaserType.deleteMany({}, (err, deleted) => {
        if (err) { return err; } else if (deleted) {
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

/**
 * @api {get} /api/v1/transform/lasercutter Transform old laser cutter db data to the current schema
 * @apiName Transform Laser Cutter
 * @apiVersion 1.0.0
 * @apiGroup Transform
 *
 * @apiSuccess {String} msg a short message that everything went well
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*    {"msg":"Transformation of laser cutters done"}
 */
function transformLaserCutters () {
  const props = Object.keys(laserCutterSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return LaserCutter.find((err, laserCutters) => {
    if (err) { return err; } else if (laserCutters) {
      LaserType.find((err, laserTypes) => {
        if (err) { return err; } else if (laserTypes) {
          return LasercutterCanLaserTypes.find((err, canLaserTypes) => {
            if (err) { return err; } else if (canLaserTypes) {
              const machines = [];
              return LaserCutter.deleteMany({}, (err, deleted) => {
                if (err) { return err; } else if (deleted) {
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
                    const newObject = {
                      fablabId: laserCutter.fid,
                      type: undefined,
                      ..._getCleanObject(laserCutter, props)
                    };
                    newObject.type = 'lasercutter';
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

/**
 * Function to transform the printer material. Needed for the printers
 */
function transformPrinterMaterial () {
  return Material.deleteMany({ type: 'printerMaterial' }, (err, deleted) => {
    if (err) { return err; } else if (deleted) {
      return PrinterMaterial.find((err, materials) => {
        if (err) { return logger.error(err); } else if (materials) {
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

/**
 * @api {get} /api/v1/transform/printer Transform old printer db data to the current schema
 * @apiName Transform Printers
 * @apiVersion 1.0.0
 * @apiGroup Transform
 *
 * @apiSuccess {String} msg a short message that everything went well
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*    {"msg":"Transformation of printers done"}
 */
function transformPrinters () {
  const props = Object.keys(printerSchema.paths).filter((prop) => prop !== '_id' && prop !== '__v');
  return oldPrinter.find((err, printers) => {
    if (err) { return err; } else if (printers) {
      Material.find((err, materials) => {
        if (err) { return err; } else if (materials) {
          return PrinterCanMaterial.find((err, canMaterials) => {
            if (err) { return err; } else if (canMaterials) {
              const machines = [];
              return Printer.deleteMany({}, (err, deleted) => {
                if (err) { return err; } else if (deleted) {
                  printers.forEach((printer) => {
                    if (printer.fid) {
                      printer.fablabId = printer.fid;
                    }
                    printer.materials = [];
                    canMaterials.forEach((material) => {
                      if (printer.id === material.printerId) {
                        const materialAdd = _find(materials, material.materialId, materialSchema);
                        if (materialAdd) {
                          printer.materials.push(materialAdd);
                        }
                      }
                    });
                    const newObject = {
                      fablabId: printer.fid,
                      type: undefined,
                      ..._getCleanObject(printer, props)
                    };
                    newObject.type = 'printer';
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

/**
 * @api {get} /api/v1/transform/cleanDocuments
 * Clean the documents of the database of unneeded fields
 * @apiName Clean Documents of DB
 * @apiVersion 1.0.0
 * @apiGroup Transform
 *
 * @apiSuccess {Array} updated is an array containing the updated documents
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*    {
    "updated": [
        [
            {
                "_id": "5b48b9c98f96232dd1646258",
                "material": "PLA",
                "id": 1,
                "type": "printerMaterial",
                "__v": 0
            },
            {
                "_id": "5b48b9c98f96232dd164625c",
                "material": "Other",
                "id": 6,
                "type": "printerMaterial",
                "__v": 0
            }
        ]
    ]
}
 */
function cleanDocuments () {
  return Promise.all([
    Material.find((err, materials) => {
      if (err) { return err; } else if (materials) {
        materials.forEach((material) => {
          material.id = undefined;
          material.save();
        });
        return materials;
      }
      return [];
    }).catch((err) => { logger.error(err); }),
    Printer.find((err, printers) => {
      if (err) { return err; } else if (printers) {
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
      if (err) { return err; } else if (millingMachines) {
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
      if (err) { return err; } else if (laserTypes) {
        laserTypes.forEach((laserType) => {
          laserType.id = undefined;
          laserType.save();
        });
        return laserTypes;
      }
      return [];
    }).catch((err) => { logger.error(err); }),
    LaserCutter.find((err, laserCutters) => {
      if (err) { return err; } else if (laserCutters) {
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
      if (err) { return err; } else if (others) {
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

/**
 * Finds an element within an array and gets the cleaned object for that element
 * array is the array containing the element
 * id is the id of the element
 * schema is the schema containing the properties
 */
function _find (array, id, schema) {
  const filteredArray = array.filter((elem) => elem.id === id);
  let elem;
  filteredArray.length > 0 ? elem = filteredArray[0] : elem = undefined;
  if (elem) {
    const props = Object.keys(schema.paths)
      .filter((prop) => prop !== '_id' && prop !== '__v');
    return _getCleanObject(elem, props);
  }
  return undefined;
}

/**
 * Removes mongo db fields which are not mentioned in the mongoose schema and returns the cleaned object

 * source is the original object of the db
 * props are the properties based on the schema of the source object
 * @returns the source object without the database fields like '__v' and '_id'
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
