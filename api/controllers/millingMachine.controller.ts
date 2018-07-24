import machineService from '../services/machine.service';

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
function getAll () {
  return machineService.getMachineType('MillingMachine');
}

export default { getAll };
