import machineService from '../services/machine.service';


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
function getAll () {
  return machineService.getMachineType('Lasercutter');
}

export default { getAll };
