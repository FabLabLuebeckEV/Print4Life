import { Material } from '../models/material.model';

function getMaterialByType (type) {
  return Material.find({ type });
}

export default {
  getMaterialByType,
};
