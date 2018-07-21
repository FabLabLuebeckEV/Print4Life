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
 */

function getFablab (id) {
  return Fablab.findOne({ fid: id });
}

export default { getFablab };
