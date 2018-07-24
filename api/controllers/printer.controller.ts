import machineService from '../services/machine.service';

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
function getAll() {
    return machineService.getMachineType('Printer');
}

function create(params) {
    return machineService.create('Printer', params);
}

// function getPrinterById (id) {
//     const query = new Order.findOne({ _id: id});
//     return query.exec();
//   return Order.findOne({ _id: id });
// }

// function placeOrder (newOrder) {
//     const order = new Order(newOrder);
//     return order.save();
//   return Order(newOrder).save();
// }

// async function updatePrinter (body) {
//     return Order.findOneAndUpdate({ _id: body._id }, body, {upsert: true} ).exec();
//   return Order.findOneAndUpdate({ _id: body._id }, body, { upsert: true }).exec();
// }


export default { getAll, create };
