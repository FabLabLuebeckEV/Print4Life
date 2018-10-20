import machineService from '../services/machine.service';

const machineType = 'otherMachine';
/**
 * @api {get} /api/v1/machines/otherMachines Get other machines
 * @apiName GetOtherMachines
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
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
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 206 Partial Content
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
function getAll (limit?: string, skip?: string) {
  let l: Number;
  let s: Number;
  if (limit && skip) {
    l = Number.parseInt(limit, 10);
    s = Number.parseInt(skip, 10);
  }
  return machineService.getMachineType(machineType, l, s);
}

/**
 * @api {post} /api/v1/machines/otherMachines/ Create new Other Machine
 * @apiName CreateNewOtherMachine
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {String} typeOfMachine the type of the machine
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
  "comment": "Create Test"
}
 *
 * @apiSuccess {Object} otherMachine the other machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachine": {
        "_id": "5b572744b5de46745af5e262",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Milling Machine",
        "manufacturer": "Test Manufacturer",
        "typeOfMachine": "Other Test Machine",
        "comment": "Create Test",
        "type": "otherMachine",
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
        "_message": "OtherMachine validation failed",
        "message": "OtherMachine validation failed: fablabId: Path `fablabId` is required.",
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
 * @api {get} /api/v1/machines/otherMachines/:id Gets a Other Machine by a given id
 * @apiName GetOtherMachineById
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam id is the id of the other machine
 *
 * @apiSuccess {Object} otherMachine the milling machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachine": {
        "_id": "5b61abb7c3f4261df9ce7673",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Other Machine",
        "manufacturer": "Test Manufacturer",
        "typeOfMachine": "Test Machine",
        "comment": "Create Test",
        "type": "otherMachine",
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
 *       "error": "Other Machine by id '9999' not found"
 *     }
 *
 *
 */
function get (id) {
  return machineService.get(machineType, id);
}

/**
 * @api {delete} /api/v1/machines/otherMachines/:id Deletes a other Machine by a given id
 * @apiName DeleteOtherMachinesById
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the other machine
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 Ok
 *
 * {
    "_id": "5b66fefec92bc40cd9dcfef3",
    "fablabId": "5b453ddb5cf4a9574849e98a",
    "deviceName": "Updated",
    "manufacturer": "Test Manufacturer",
    "typeOfMachine": "Test Machine",
    "comment": "Create Test",
    "type": "otherMachine",
    "__v": 0
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
    "error": "Malformed request!"
}

 * @apiError 404 Other Machine not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
{
    "error: `Other Machine by id 9999 not found!`"
}
 *
 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
    "error": "Error while trying to get the Other Machine by id 9999",
}

 * @apiError 500 Server Error
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
{
   "error": "Error while trying to delete the Other Machine with id 9999"
}
 *
 *
 */
function deleteById (id) {
  return machineService.deleteById(machineType, id);
}

/**
 * @api {put} /api/v1/machines/otherMachines/:id Updates a Other Machine by a given id
 * @apiName UpdateOtherMachineByID
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the other machine
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {String} typeOfMachine the type of the machine
 * @apiParam {String} comment a comment about the device
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66bbf95772aa134cf70d69",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Updated",
    "manufacturer" : "Test Manufacturer",
    "typeOfMachine" : "Test Machine",
    "comment" : "Create Test",
    "type" : "otherMachine",
    "__v" : 0
}
 * @apiSuccess {Object} otherMachine the other machine object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "otherMachine": {
        "_id": "5b66bbf95772aa134cf70d69",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Updated",
        "manufacturer": "Test Manufacturer",
        "typeOfMachine": "Test Machine",
        "comment": "Create Test",
        "type": "otherMachine",
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
 *       "error": "Other Machine by id '9999' not found"
 *     }
 *
 *
 */
function update (id, machine) {
  return machineService.update(machineType, id, machine);
}

/**
 * @api {get} /api/v1/machines/otherMachines/count Counts the Other Machines
 * @apiName CountOtherMachines
 * @apiVersion 1.0.0
 * @apiGroup OtherMachines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Object} count the number of other machines
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *
{
    "count": 98
}
 *
 */
function count () {
  return machineService.count(machineType);
}

export default { getAll, create, get, deleteById, update, count };
