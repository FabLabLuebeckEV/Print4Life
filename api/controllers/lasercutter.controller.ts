import machineService from '../services/machine.service';
import { LaserType } from '../models/lasertype.model';

/**
 * @api {get} /api/v1/machines/lasercutters Get lasercutters
 * @apiName GetLasercutters
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
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
  return machineService.getMachineType('lasercutter');
}

/**
 * @api {post} /api/v1/machines/lasercutters/create Create new Lasercutter
 * @apiName CreateNewLasercutter
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 *
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {Array} laserTypes array of laserType objects
 * @apiParam {Number} workspaceX space of axis x
 * @apiParam {Number} workspaceY space volume of axis y
 * @apiParam {Number} workspaceY space volume of axis z
 * @apiParam {Number} maxResoultion resolution of lasercutter
 * @apiParam {String} laserPower power of the laser
 * @apiParam {String} pictureUrl url to a picture of this device
 * @apiParam {String} comment a comment about the device
 * @apiParamExample {json} Request-Example:
 *
{
  "fablabId": "5b453ddb5cf4a9574849e98a",
  "deviceName":"Test Lasercutter" ,
  "manufacturer": "Test Manufacturer" ,
  "laserTypes": [{
    "laserType": "CO2"
  }],
  "workspaceX": 2,
  "workspaceY": 2,
  "workspaceZ": 2,
  "maxResoultion": 2,
  "laserPower": "High",
  "pictureURL": "",
  "comment": "Create Test"
}
 *
 * @apiSuccess {Object} lasercutter the lasercutter object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutter": {
        "_id": "5b571e4dfeb1a9647183fcd8",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Lasercutter",
        "manufacturer": "Test Manufacturer",
        "laserTypes": [
            {
                "laserType": "CO2"
            }
        ],
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "maxResoultion": 2,
        "laserPower": "High",
        "pictureURL": "",
        "comment": "Create Test",
        "type": "lasercutter",
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
        "_message": "Lasercutter validation failed",
        "message": "Lasercutter validation failed: fablabId: Path `fablabId` is required.",
        "name": "ValidationError"
    }
}
 *
 *
 */
function create (params) {
  return machineService.create('lasercutter', params);
}

/**
 * @api {post} /api/v1/machines/lasercutters/laserTypes Get Lasertypes of Lasercutters
 * @apiName GetLaserTypes
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 *
 *
 *
 * @apiSuccess {Object} lasercutter the lasercutter object
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
 *
 *
 */
function getLaserTypes () {
  return LaserType.find();
}

/**
 * @api {get} /api/v1/machines/lasercutters/:id Gets a Lasercutter by a given id
 * @apiName GetLasercutterById
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 *
 *
 * @apiParam {id} is the id of the lasercutter
 *
 * @apiSuccess {Object} lasercutter the lasercutter object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutter": {
        "_id": "5b62b46ea519361b031d51b8",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Lasercutter",
        "manufacturer": "Test Manufacturer",
        "laserTypes": [
            {
                "_id": "5b62b46ea519361b031d51b9",
                "laserType": "CO2"
            }
        ],
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
        "maxResoultion": 2,
        "laserPower": "High",
        "pictureURL": "",
        "comment": "Create Test",
        "type": "lasercutter",
        "__v": 0
    }
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Id needs to be a 24 character long hex string!"
}
 *
 *
 */
function get (id) {
  return machineService.get('lasercutter', id);
}

/**
 * @api {delete} /api/v1/machines/lasercutters/:id Deletes a Lasercutter by a given id
 * @apiName DeleteLasercutterById
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 *
 *
 * @apiParam {id} is the id of the lasercutter
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Id needs to be a 24 character long hex string!"
}
 *
 *
 */
function deleteById (id) {
  return machineService.deleteById('lasercutter', id);
}

export default { getAll, create, getLaserTypes, deleteById, get };
