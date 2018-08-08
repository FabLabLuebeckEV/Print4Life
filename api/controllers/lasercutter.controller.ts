import machineService from '../services/machine.service';
import { LaserType } from '../models/lasertype.model';

const machineType = 'lasercutter';

/**
 * @api {get} /api/v1/machines/lasercutters Get lasercutters
 * @apiName GetLasercutters
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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

 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 */
function getAll () {
  return machineService.getMachineType(machineType);
}

/**
 * @api {post} /api/v1/machines/lasercutters/ Create new Lasercutter
 * @apiName CreateNewLasercutter
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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
  return machineService.create(machineType, params);
}

/**
 * @api {get} /api/v1/machines/lasercutters/laserTypes Get Lasertypes of Lasercutters
 * @apiName GetLaserTypes
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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

 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
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
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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
 * @apiError 404 The object was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Lasercutter by id '9999' not found"
 *     }
 *
 *
 */
function get (id) {
  return machineService.get(machineType, id);
}

/**
 * @api {delete} /api/v1/machines/lasercutters/:id Deletes a Lasercutter by a given id
 * @apiName DeleteLasercutterById
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the lasercutter
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
 * {
    "_id": "5b695b6ff371a21d0c858f2a",
    "fablabId": "5b453ddb5cf4a9574849e98a",
    "deviceName": "Test Lasercutter",
    "manufacturer": "Test Manufacturer",
    "laserTypes": [
        {
            "_id": "5b695b6ff371a21d0c858f2b",
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
 *
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Id needs to be a 24 character long hex string!"
}

 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "Malformed request!"
}

 * @apiError 404 Lasercutter not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "error: `Lasercutter by id 9999 not found!`"
}
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
    "error": "Error while trying to get the Lasercutter by id 9999",
}

 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
   "error": "Error while trying to delete the Lasercutter with id 9999"
}
 *
 *
 */
function deleteById (id) {
  return machineService.deleteById(machineType, id);
}

/**
 * @api {put} /api/v1/machines/lasercutters/:id Updates a Lasercutter by a given id
 * @apiName UpdateLasercutterByID
 * @apiVersion 1.0.0
 * @apiGroup Lasercutters
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the lasercutter
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
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66c55aab1b741fbbc2fd3c",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Updated",
    "manufacturer" : "Test Manufacturer",
    "laserTypes" : [
        {
            "_id" : "5b66c55aab1b741fbbc2fd3d",
            "laserType" : "CO2"
        }
    ],
    "workspaceX" : 2,
    "workspaceY" : 2,
    "workspaceZ" : 2,
    "maxResoultion" : 2,
    "laserPower" : "High",
    "pictureURL" : "",
    "comment" : "Create Test",
    "type" : "lasercutter",
    "__v" : 0
}
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "lasercutter": {
        "_id": "5b66c55aab1b741fbbc2fd3c",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Updated",
        "manufacturer": "Test Manufacturer",
        "laserTypes": [
            {
                "_id": "5b66c55aab1b741fbbc2fd3d",
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
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "error": "No params to update given!"
}
 * @apiError 404 The object was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Lasercutter by id '9999' not found"
 *     }
 *
 *
 */
function update (id, machine) {
  return machineService.update(machineType, id, machine);
}

export default { getAll, create, getLaserTypes, deleteById, get, update };
