import * as fs from 'fs';
import machineService from '../services/machine.service';
import materialService from '../services/material.service';
import lasertypeService from '../services/lasertype.service';

/**
 * @api {get} /api/v1/machines/ Get all machines
 * @apiName GetMachines
 * @apiVersion 1.0.0
 * @apiGroup Machines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Array} machines an array of an array of machine objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "machines": {
        "printers": [
            {
                "_id": "5b51c25c1058dc2189272733",
                "fablabId": 2,
                "type": "printer",
                "deviceName": "Dimension Elite",
                "manufacturer": "Stratasys",
                "materials": [],
                "camSoftware": "",
                "printVolumeX": 203,
                "printVolumeY": 203,
                "printVolumeZ": 305,
                "printResolutionX": 0.1,
                "printResolutionY": 0.1,
                "printResolutionZ": 1.75,
                "nozzleDiameter": 0.4,
                "numberOfExtruders": 2,
                "comment": "Dissolvable support (acidbath)\n",
                "__v": 0
            }
        ],
        "lasercutters": [
            {
                "_id": "5b51c25c1058dc2189272724",
                "fablabId": 2,
                "type": "lasercutter",
                "deviceName": "Helix",
                "manufacturer": "Epilog",
                "laserTypes": [
                    {
                        "_id": "5b51c25c1058dc2189272723",
                        "laserType": "CO2",
                        "id": 1
                    }
                ],
                "camSoftware": "",
                "workspaceX": 600,
                "workspaceY": 450,
                "workspaceZ": 350,
                "laserPower": "40",
                "comment": "",
                "__v": 0
            }
        ],
        "millingMachines": [
            {
                "_id": "5b51c25c1058dc218927272e",
                "fablabId": 3,
                "type": "millingMachine",
                "deviceName": "High-Z S-720T",
                "manufacturer": "CNC-Step",
                "camSoftware": "",
                "workspaceX": 720,
                "workspaceY": 420,
                "workspaceZ": 110,
                "movementSpeed": 0,
                "stepSize": null,
                "comment": "",
                "__v": 0
            }
        ],
        "otherMachines": [
            {
                "_id": "5b51c25c1058dc218927273e",
                "fablabId": 2,
                "type": "otherMachine",
                "deviceName": "Sign Maker BN-20",
                "manufacturer": "Roland",
                "typeOfMachine": "Cutting Plotter",
                "comment": "",
                "__v": 0
            }
        ]
    }
}
 */

function getAllMachines () {
  return machineService.getMachineType('all');
}

/**
 * @api {get} /api/v1/machines/types Get all machine types
 * @apiName GetMachineTypes
 * @apiVersion 1.0.0
 * @apiGroup Machines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Array} types an array of strings giving information about the machine types
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "types": [
        "Lasercutter",
        "Milling Machine",
        "Other Machine",
        "Printer"
    ]
}
 */
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

/**
 * @api {get} /api/v1/machines/materials/:machine Get materials per machine type
 * @apiName GetMaterialsByType
 * @apiVersion 1.0.0
 * @apiGroup Materials
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} machine is the name of the machine type
 * @apiSuccess {Array} materials an array of materials for a given machine type
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "types": [
        "Lasercutter",
        "Milling Machine",
        "Other Machine",
        "Printer"
    ]
}
 */
function getMaterialsByType (type) {
  type += 'Material';
  return materialService.getMaterialByType(type);
}

/**
 * @api {get} /api/v1/machines/lasertypes/ Get all lasertypes
 * @apiName GetLaserTypes
 * @apiVersion 1.0.0
 * @apiGroup LaserTypes
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Array} laserTypes an array of all laserTypes
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "laserTypes": [
        {
            "_id": "5b55f7bf3fe0c8b01713b3dc",
            "laserType": "CO2",
            "__v": 0
        }
    ]
}
 */
function getLaserTypes () {
  return lasertypeService.getLaserTypes();
}

export default { getAllMachines, getMachineTypes, getMaterialsByType, getLaserTypes };
