import * as mongoose from 'mongoose';

import fablabSchema from '../models/fablab.model';

const Fablab = mongoose.model('Fablab', fablabSchema);

/**
 * @api {get} /api/v1/fablab/:id Get fablab
 * @apiName GetFablabById
 * @apiVersion 1.0.0
 * @apiGroup Fablabs
 *
 * @apiParam {Number} id (old) id of the fablab (the id is named fid on each machine)
 *
 * @apiSuccess {Object} fablab the fablab object
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "fablab": {
        "_id": "5b51e86f5cf4a957484a8156",
        "fid": "2",
        "name": "FabLab EAL",
        "phone": null,
        "mail": "Micj@eal.dk",
        "password": "$2y$10$f3mwR3rlkbwd8w7AZUtza.jI4FmuB9qeWvsVNXzubzxZPVW3hAW82"
    }
}
 * @apiError 400 The request is malformed (most likely a wrong type of id is given)
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
 *     {
 *       "error": "Id needs to be a positive number!"
 *     }
 *
 *
 * @apiError 404 The fablab by its id was not found (there is no entry for the given id)
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Fablab by id '9999' not found"
 *     }
 *
 */

function getFablab (id) {
  return Fablab.findOne({ fid: id });
}

export default { getFablab };
