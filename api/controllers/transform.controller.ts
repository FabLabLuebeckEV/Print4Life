import * as mongoose from 'mongoose';

import logger from '../logger';
import printerSchema from '../models/printer.model';
import printerMaterialSchema from '../models/printerMaterial.model';
import printerCanMaterialSchema from '../models/printerCanMaterial.model';

const Printer = mongoose.model('Printer', printerSchema);
const PrinterMaterial = mongoose.model('PrinterMaterial', printerMaterialSchema);
const PrinterCanMaterial = mongoose.model('PrinterCanMaterial', printerCanMaterialSchema);

const Machine = mongoose.model('Machine', printerSchema);
const Material = mongoose.model('Material', printerMaterialSchema);

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
  return Machine.deleteMany({ type: 'printer' }, (err, deleted) => {
    if (err) return err;
    else if (deleted) {
      return Printer.find((err, printers) => {
        if (err) return err;
        else if (printers) {
          Material.find((err, materials) => {
            if (err) return err;
            else if (materials) {
              return PrinterCanMaterial.find((err, canMaterials) => {
                if (err) return err;
                else if (canMaterials) {
                  const machines = [];
                  printers.forEach((printer) => {
                    !printer.type ? printer.type = 'printer' : '';
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
                    const newObject = { type: 'printer', ..._getCleanObject(printer, props) };
                    const newMachine = new Machine(newObject);
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
      }
      return [];
    }),
    Machine.find((err, machines) => {
      if (err) return err;
      else if (machines) {
        machines.forEach((machine) => {
          machine.id = undefined;
          machine.pictureURL = undefined;
          machine.fid = undefined;
          machine.save();
        });
        return { machines };
      }
      return [];
    })]);
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

export default { transformPrinterMaterial, transformPrinters, cleanDocuments };
