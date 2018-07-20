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
 * @api {get} /api/v1/machine/ Get all machines
 * @apiName GetMachines
 * @apiVersion 1.0.0
 * @apiGroup Machines
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
  return _getMachineType('all');
}

/**
 * @api {get} /api/v1/machine/printer Get printers
 * @apiName GetPrinters
 * @apiVersion 1.0.0
 * @apiGroup Machines
 *
 * @apiSuccess {Array} printers an array of printer objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*    {
      "printers": [
        {
            "_id": "5b453dbe5cf4a9574849e96e",
            "id": 3,
            "fid": 2,
            "deviceName": "Ultimaker 2+",
            "manufacturer": "Ultimaker",
            "camSoftware": "Cura",
            "printVolumeX": 210,
            "printVolumeY": 210,
            "printVolumeZ": 205,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 0.5,
            "nozzleDiameter": 0.4,
            "numberOfExtruders": 1,
            "pictureURL": "upload/59e5da27a317a.jpg",
            "comment": ""
        },
        {
            "_id": "5b453dbe5cf4a9574849e96f",
            "id": 4,
            "fid": 2,
            "deviceName": "Zprinter 450",
            "manufacturer": "Zcorp",
            "camSoftware": "",
            "printVolumeX": 200,
            "printVolumeY": 200,
            "printVolumeZ": 180,
            "printResolutionX": 0.1,
            "printResolutionY": 0.1,
            "printResolutionZ": 1,
            "nozzleDiameter": null,
            "numberOfExtruders": 0,
            "pictureURL": "upload/59e5dc87040cc.jpg",
            "comment": "Full Color printer"
        }
      ]
    }
 */
function getPrinters () {
  return _getMachineType('Printer');
}

/**
 * @api {get} /api/v1/machine/lasercutter Get lasercutters
 * @apiName GetLasercutters
 * @apiVersion 1.0.0
 * @apiGroup Machines
 *
 * @apiSuccess {Array} lasercutters an array of lasercutter objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
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
        },
        {
            "_id": "5b51c25c1058dc2189272728",
            "fablabId": 4,
            "type": "lasercutter",
            "deviceName": "MARS-130",
            "manufacturer": "Thunderlaser",
            "laserTypes": [
                {
                    "_id": "5b51c25c1058dc2189272727",
                    "laserType": "CO2",
                    "id": 1
                }
            ],
            "camSoftware": "RD-Works",
            "workspaceX": 1500,
            "workspaceY": 900,
            "workspaceZ": 250,
            "laserPower": "100",
            "comment": "",
            "__v": 0
        }
    ]
}
 */
function getLasercutters () {
  return _getMachineType('Lasercutter');
}

/**
 * @api {get} /api/v1/machine/otherMachine Get other machines
 * @apiName GetOtherMachines
 * @apiVersion 1.0.0
 * @apiGroup Machines
 *
 * @apiSuccess {Array} otherMachines an array of other machine objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
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
        },
        {
            "_id": "5b51c25c1058dc2189272742",
            "fablabId": 3,
            "type": "otherMachine",
            "deviceName": "NAO",
            "manufacturer": "Softbank Robotics",
            "typeOfMachine": "Humanoid Robot",
            "comment": "",
            "__v": 0
        }
    ]
}
 */
function getOtherMachines () {
  return _getMachineType('OtherMachine');
}

/**
 * @api {get} /api/v1/machine/millingMachine Get milling machines
 * @apiName GetMillingMachines
 * @apiVersion 1.0.0
 * @apiGroup Machines
 *
 * @apiSuccess {Array} millingMachines an array of milling machine objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
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
        },
        {
            "_id": "5b51c25c1058dc218927272d",
            "fablabId": 2,
            "type": "millingMachine",
            "deviceName": "PRSALPHA",
            "manufacturer": "SHOPBOT",
            "camSoftware": "",
            "workspaceX": 2550,
            "workspaceY": 1500,
            "workspaceZ": 200,
            "movementSpeed": 12000,
            "stepSize": null,
            "comment": "",
            "__v": 0
        }
    ]
}
 */
function getMillingMachines () {
  return _getMachineType('MillingMachine');
}

/**
 * This method gets a specific type of machine (or all) and returns a promis with the results
 * type is the type of machine to get
 * @returns a promise with the results
 */
function _getMachineType (type) {
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

export default { getAllMachines, getPrinters, getLasercutters, getOtherMachines, getMillingMachines };
