import * as mongoose from 'mongoose';

import Fablab from '../models/fablab.model';

/**
 * @api {get} /api/v1/fablabs/:id Get fablab
 * @apiName GetFablabById
 * @apiVersion 1.0.0
 * @apiGroup Fablabs
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
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
  const _id = mongoose.Types.ObjectId(id);
  return Fablab.findOne({ _id });
}

/**
 * @api {get} /api/v1/fablabs/ Get all fablabs
 * @apiName GetAllFablabs
 * @apiVersion 1.0.0
 * @apiGroup Fablabs
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Object} fablabs is an array of fablab objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "fablabs": [
        {
            "_id": "5b453ddb5cf4a9574849e98a",
            "name": "test",
            "phone": 1234,
            "mail": "test@test.de",
            "password": "$2y$10$sDebOY1Kx8LZNczsF3XjoOqdZHRJK0J80hc7SdEZ19hKDFmkx0owG"
        }
    ]
}
 */

function getAll () {
  return Fablab.find();
}

export default { getFablab, getAll };
