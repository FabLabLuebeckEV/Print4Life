import * as fs from 'fs';
import machineService from '../services/machine.service';
import materialService from '../services/material.service';

function getAllMachines () {
  return machineService.getMachineType('all');
}

function getMachineTypes () {
  return new Promise((resolve, reject) => {
    fs.readdir('api/models/machines', ((err, files) => {
      if (err) {
        reject(err);
      } else {
        const types = [];
        files.forEach((file) => {
          if (!file.startsWith('machine.basic')) {
            const split = file.split('.');
            let type = '';
            for (let i = 0; i < split.length; i += 1) {
              if (split[i] !== 'ts' && split[i] !== 'model') {
                split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);
                type += `${split[i]} `;
              }
            }
            types.push(type.trim());
          }
        });
        resolve(types);
      }
    }));
  });
}

function getMaterialsByType (type) {
  type += 'Material';
  return materialService.getMaterialByType(type);
}

export default { getAllMachines, getMachineTypes, getMaterialsByType };
