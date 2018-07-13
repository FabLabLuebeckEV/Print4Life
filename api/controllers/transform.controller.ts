import * as mongoose from 'mongoose';

import logger from '../logger';
import printerSchema from '../models/printer.model';
import printerMaterialSchema from '../models/printerMaterial.model';
import printerCanMaterialSchema from '../models/printerCanMaterial.model';
import otherMachineSchema from '../models/other.machine.model';

const oldPrinter = mongoose.model('Printer', printerSchema);
const Printer = mongoose.model('Printer', printerSchema);
const PrinterMaterial = mongoose.model('PrinterMaterial', printerMaterialSchema);
const PrinterCanMaterial = mongoose.model('PrinterCanMaterial', printerCanMaterialSchema);
const Material = mongoose.model('Material', printerMaterialSchema);

const oldOther = mongoose.model('otherMachine', otherMachineSchema);
const Other = mongoose.model('otherMachine', otherMachineSchema);

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
            const newObject = { ..._getCleanObject(oldOther, props) };
            const newMachine = new Other(newObject);
            newMachine.save();
            machines.push(newMachine);
          });
          return machines;
        }
        return [];
      });
    }
    return [];
  });
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
      });
    }
    return [];
  });
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
                        const materialAdd = _findMaterial(materials, material.materialId);
                        if (materialAdd) {
                          printer.materials.push(materialAdd);
                        }
                      }
                    });
                    const newObject = { ..._getCleanObject(printer, props) };
                    const newPrinter = new Printer(newObject);
                    newPrinter.save();
                    machines.push(newPrinter);
                  });
                  return machines;
                }
                return [];
              });
            }
            return [];
          });
        }
        return [];
      });
    }
    return [];
  });
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
    }),
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
    }),
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
    })
  ]);
}

function _findMaterial (materials, id) {
  const filteredMaterials = materials.filter((elem) => elem.id === id);
  let material;
  filteredMaterials.length > 0 ? material = filteredMaterials[0] : material = undefined;
  if (material) {
    const props = Object.keys(printerMaterialSchema.paths)
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

export default { transformPrinterMaterial, transformPrinters, cleanDocuments, transformOthers };
