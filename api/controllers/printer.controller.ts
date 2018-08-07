import machineService from '../services/machine.service';

const machineType = 'printer';

/**
 * @api {get} /api/v1/machines/printers Get printers
 * @apiName GetPrinters
 * @apiVersion 1.0.0
 * @apiGroup Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Array} printers an array of printer objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "printers": [
        {
            "_id": "5b55f7bf3fe0c8b01713b3fa",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "printer",
            "deviceName": "Ultimaker 2+",
            "manufacturer": "Ultimaker",
            "materials": [
                {
                    "material": "PLA",
                    "type": "printerMaterial"
                }
            ],
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
            "comment": "",
            "__v": 0
        },
        {
            "_id": "5b55f7bf3fe0c8b01713b3fc",
            "fablabId": "5b453ddb5cf4a9574849e98b",
            "type": "printer",
            "deviceName": "Zprinter 450",
            "manufacturer": "Zcorp",
            "materials": [
                {
                    "material": "Plaster",
                    "type": "printerMaterial"
                }
            ],
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
            "comment": "Full Color printer",
            "__v": 0
        }
      ]
    }
 */
function getAll () {
  return machineService.getMachineType(machineType);
}

/**
 * @api {post} /api/v1/machines/printers/create Create new Printer
 * @apiName CreateNewPrinter
 * @apiVersion 1.0.0
 * @apiGroup Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {Array} materials array of material objects
 * @apiParam {String} camSoftware name of the cam software
 * @apiParam {Number} printVolumeX print volume of axis x
 * @apiParam {Number} printVolumeY print volume of axis y
 * @apiParam {Number} printVolumeZ print volume of axis z
 * @apiParam {Number} printResolutionX resolution of the print at axis x
 * @apiParam {Number} printResolutionY resolution of the print at axis y
 * @apiParam {Number} printResolutionZ resolution of the print at axis z
 * @apiParam {Number} nozzleDiameter the nozzle diameter
 * @apiParam {Number} numberOfExtruders the number of extruders
 * @apiParam {String} pictureUrl url to a picture of this device
 * @apiParam {String} comment a comment about the device
 * @apiParamExample {json} Request-Example:
 *
 {
   "fablabId": "5b453ddb5cf4a9574849e98a",
   "deviceName":"Test Printer" ,
   "manufacturer": "Test Manufacturer" ,
   "materials": [{
     "material": "PLA",
     "type": "printerMaterial"
   }],
   "camSoftware": "Test Software",
   "printVolumeX": 2,
   "printVolumeY": 2,
   "printVolumeZ": 2,
   "printResolutionX": 2,
   "printResolutionY": 2,
   "printResolutionZ": 2,
   "nozzleDiameter": 2,
   "numberOfExtruders": 2,
   "pictureURL": "",
   "comment": "Create Test"
}
 *
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 OK
{
    "printer": {
        "_id": "5b571447d748f04e8a0581ab",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Printer",
        "type": "printer",
        "manufacturer": "Test Manufacturer",
        "materials": [
            {
                "material": "PLA",
                "type": "printerMaterial"
            }
        ],
        "camSoftware": "Test Software",
        "printVolumeX": 2,
        "printVolumeY": 2,
        "printVolumeZ": 2,
        "printResolutionX": 2,
        "printResolutionY": 2,
        "printResolutionZ": 2,
        "nozzleDiameter": 2,
        "numberOfExtruders": 2,
        "pictureURL": "",
        "comment": "Create Test",
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
        "_message": "Printer validation failed",
        "message": "Printer validation failed: fablabId: Path `fablabId` is required.",
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
 * @api {delete} /api/v1/machines/printers/:id Deletes a Printer by a given id
 * @apiName DeletePrinterById
 * @apiVersion 1.0.0
 * @apiGroup Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the printer
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
  return machineService.deleteById(machineType, id);
}

/**
 * @api {get} /api/v1/machines/printers/:id Gets a Printer by a given id
 * @apiName GetPrinterById
 * @apiVersion 1.0.0
 * @apiGroup Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the printer
 *
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "printer": {
        "_id": "5b61b2a1ed80e42748255735",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Printer",
        "manufacturer": "Test Manufacturer",
        "materials": [
            {
                "_id": "5b61b2a1ed80e42748255736",
                "material": "PLA",
                "type": "printerMaterial"
            }
        ],
        "camSoftware": "Test Software",
        "printVolumeX": 2,
        "printVolumeY": 2,
        "printVolumeZ": 2,
        "printResolutionX": 2,
        "printResolutionY": 2,
        "printResolutionZ": 2,
        "nozzleDiameter": 2,
        "numberOfExtruders": 2,
        "pictureURL": "",
        "comment": "Create Test",
        "type": "printer",
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
 *       "error": "Printer by id '9999' not found"
 *     }
 *
 *
 */
function get (id) {
  return machineService.get(machineType, id);
}

/**
 * @api {put} /api/v1/machines/printers/:id Updates a Printer by a given id
 * @apiName UpdatePrinterByID
 * @apiVersion 1.0.0
 * @apiGroup Printers
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the printer
 * @apiParam {String} fablabId id of the corresponding fablab (required)
 * @apiParam {String} deviceName name of the device (required)
 * @apiParam {String} manufacturer name of the manufacturer of the device
 * @apiParam {Array} materials array of material objects
 * @apiParam {String} camSoftware name of the cam software
 * @apiParam {Number} printVolumeX print volume of axis x
 * @apiParam {Number} printVolumeY print volume of axis y
 * @apiParam {Number} printVolumeZ print volume of axis z
 * @apiParam {Number} printResolutionX resolution of the print at axis x
 * @apiParam {Number} printResolutionY resolution of the print at axis y
 * @apiParam {Number} printResolutionZ resolution of the print at axis z
 * @apiParam {Number} nozzleDiameter the nozzle diameter
 * @apiParam {Number} numberOfExtruders the number of extruders
 * @apiParam {String} pictureUrl url to a picture of this device
 * @apiParam {String} comment a comment about the device
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "_id" : "5b66a9d7cdb16f0a3e528630",
    "fablabId" : "5b453ddb5cf4a9574849e98a",
    "deviceName" : "Test Printer (Updated)",
    "manufacturer" : "Test Manufacturer",
    "materials" : [
        {
            "_id" : "5b66a9d7cdb16f0a3e528631",
            "material" : "PLA",
            "type" : "printerMaterial"
        }
    ],
    "camSoftware" : "Test Software",
    "printVolumeX" : 2,
    "printVolumeY" : 2,
    "printVolumeZ" : 2,
    "printResolutionX" : 2,
    "printResolutionY" : 2,
    "printResolutionZ" : 2,
    "nozzleDiameter" : 2,
    "numberOfExtruders" : 2,
    "pictureURL" : "",
    "comment" : "Create Test",
    "type" : "printer",
    "__v" : 0
}
 * @apiSuccess {Object} printer the printer object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "printer": {
        "_id": "5b66a9d7cdb16f0a3e528630",
        "fablabId": "5b453ddb5cf4a9574849e98a",
        "deviceName": "Test Printer (Updated)",
        "manufacturer": "Test Manufacturer",
        "materials": [
            {
                "_id": "5b66a9d7cdb16f0a3e528631",
                "material": "PLA",
                "type": "printerMaterial"
            }
        ],
        "camSoftware": "Test Software",
        "printVolumeX": 2,
        "printVolumeY": 2,
        "printVolumeZ": 2,
        "printResolutionX": 2,
        "printResolutionY": 2,
        "printResolutionZ": 2,
        "nozzleDiameter": 2,
        "numberOfExtruders": 2,
        "pictureURL": "",
        "comment": "Create Test",
        "type": "printer",
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
 *       "error": "Printer by id '9999' not found"
 *     }
 *
 *
 */
function update (id, machine) {
  return machineService.update(machineType, id, machine);
}


export default { getAll, create, deleteById, get, update };
