import machineService from '../services/machine.service';

/**
 * @api {get} /api/v1/machine/millingMachine Get milling machines
 * @apiName GetMillingMachines
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
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
function getAll() {
    return machineService.getMachineType('millingMachine');
}

/**
 * @api {post} /api/v1/machines/lasercutters/create Create new Milling Machine
 * @apiName CreateNewMillingMachine
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 *
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {String} camSoftware name of the camera software
 * @apiParam {Number} workspaceX space of axis x
 * @apiParam {Number} workspaceY space volume of axis y
 * @apiParam {Number} workspaceY space volume of axis z
 * @apiParam {Number} movementSpeed speed of the milling machine
 * @apiParam {String} stepSize size of the steps
 * @apiParam {String} pictureUrl url to a picture of this device
 * @apiParam {String} comment a comment about the device
 * @apiParamExample {json} Request-Example:
 *
{
  "fablabId": "5b453ddb5cf4a9574849e98a",
  "deviceName":"Test Milling Machine" ,
  "manufacturer": "Test Manufacturer" ,
  "camSoftware": "Test Cam Software",
  "workspaceX": 2,
  "workspaceY": 2,
  "workspaceZ": 2,
  "movementSpeed": 2,
  "stepSize": 2,
  "pictureURL": "",
  "comment": "Create Test"
}
 *
 * @apiSuccess {Object} millingMachine the milling machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "millingMachine": {
        "_id": "5b57234cb25dad6d0f95b7a7",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Milling Machine",
        "manufacturer": "Test Manufacturer",
        "camSoftware": "Test Cam Software",
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "movementSpeed": 2,
        "stepSize": 2,
        "pictureURL": "",
        "comment": "Create Test",
        "type": "millingMachine",
        "__v": 0
    }
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "err": "Malformed request!",
    "stack": {
        "errors": {
            "fablabId": {
                "message": "Path `fablabId` is required.",
                "name": "ValidatorError",
                "properties": {
                    "message": "Path `fablabId` is required.",
                    "type": "required",
                    "path": "fablabId",
                    "value": ""
                },
                "kind": "required",
                "path": "fablabId",
                "value": "",
                "$isValidatorError": true
            }
        },
        "_message": "MillingMachine validation failed",
        "message": "MillingMachine validation failed: fablabId: Path `fablabId` is required.",
        "name": "ValidationError"
    }
}
 *
 *
 */
function create(params) {
    return machineService.create('millingMachine', params);
}

export default { getAll, create };
