import machineService from '../services/machine.service';

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
  return machineService.getMachineType('all');
}

export default { getAllMachines };
