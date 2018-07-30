import * as mongoose from 'mongoose';

const attributes = {
  printerId: {
    type: Number,
    required: true
  },
  materialId: {
    type: Number,
    required: true
  },
};

export const printerCanMaterialSchema = mongoose.Schema(attributes);
export const PrinterCanMaterial = mongoose.model('PrinterCanMaterial', printerCanMaterialSchema);

export default PrinterCanMaterial;
