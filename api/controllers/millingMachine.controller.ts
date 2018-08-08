import machineService from '../services/machine.service';

const machineType = 'millingMachine';

/**
 * @api {get} /api/v1/machines/millingMachines Get milling machines
 * @apiName GetMillingMachines
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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
  return machineService.getMachineType(machineType);
}

/**
 * @api {post} /api/v1/machines/millingMachines/create Create new Milling Machine
 * @apiName CreateNewMillingMachine
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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
function create (params) {
  return machineService.create(machineType, params);
}

/**
 * @api {get} /api/v1/machines/millingMachines/:id Gets a Milling Machine by a given id
 * @apiName GetMillingMachineById
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the milling machine
 *
 * @apiSuccess {Object} millingMachine the milling machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "millingMachine": {
        "_id": "5b62bd1c41736630fde4d2f2",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Milling Machine",
        "manufacturer": "Test Manufacturer",
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
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
    "error": "Id needs to be a 24 character long hex string!"
}
 * @apiError 404 The object was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Milling Machine by id '9999' not found"
 *     }
 *
 *
 */
function get (id) {
  return machineService.get(machineType, id);
}

/**
 * @api {delete} /api/v1/machines/millingMachines/:id Deletes a Milling Machine by a given id
 * @apiName DeleteMillingMachineById
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the milling machine
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
 * {
    "_id": "5b6ab21499f236256541caf7",
    "fablabId": "5b453ddb5cf4a9574849e98a",
    "deviceName": "Test Milling Machine",
    "manufacturer": "Test Manufacturer",
    "workspaceX": 2,
    "workspaceY": 2,
    "workspaceZ": 2,
    "pictureURL": "",
    "comment": "Create Test",
    "type": "millingMachine",
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

 * @apiError 404 Milling Machine not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "error: `Milling Machine by id 9999 not found!`"
}
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
    "error": "Error while trying to get the Milling Machine by id 9999",
}

 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
   "error": "Error while trying to delete the Milling Machine with id 9999"
}
 *
 *
 */
function deleteById (id) {
  return machineService.deleteById(machineType, id);
}

/**
 * @api {put} /api/v1/machines/millingMachines/:id Updates a Milling Machine by a given id
 * @apiName UpdateMillingMachineByID
 * @apiVersion 1.0.0
 * @apiGroup MillingMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the milling machine
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
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66c32d12e78b1ba254824e",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Updated",
    "manufacturer" : "Test Manufacturer",
    "workspaceX" : 2,
    "workspaceY" : 2,
    "workspaceZ" : 2,
    "pictureURL" : "",
    "comment" : "Create Test",
    "type" : "millingMachine",
    "__v" : 0
}
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "millingMachine": {
        "_id": "5b66c32d12e78b1ba254824e",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Updated",
        "manufacturer": "Test Manufacturer",
        "workspaceX": 2,
        "workspaceY": 2,
        "workspaceZ": 2,
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
 *       "error": "Milling Machine by id '9999' not found"
 *     }
 *
 *
 */
function update (id, machine) {
  return machineService.update(machineType, id, machine);
}

export default { getAll, create, get, deleteById, update };
