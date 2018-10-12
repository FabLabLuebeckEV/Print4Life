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
        "activated": true,
        "_id": "5bc05a26cdd1c72c56834b6f",
        "name": "Fablab Ostsee e.V.",
        "address": {
            "street": "Milkyway 5",
            "zipCode": "33445",
            "city": "City of Nowhere",
            "country": "Dreamland"
        },
        "__v": 0
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

function get (id) {
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
            "activated": true,
            "_id": "5bc05a26cdd1c72c56834b6d",
            "name": "Updated",
            "address": {
                "street": "Milkyway 5",
                "zipCode": "33445",
                "city": "City of Nowhere",
                "country": "Dreamland"
            },
            "__v": 0
        },
        {
            "activated": true,
            "_id": "5bc05a26cdd1c72c56834b6f",
            "name": "Fablab Ostsee e.V.",
            "address": {
                "street": "Milkyway 5",
                "zipCode": "33445",
                "city": "City of Nowhere",
                "country": "Dreamland"
            },
            "__v": 0
        }
    ]
}
 */

function getAll () {
  return Fablab.find();
}

/**
 * @api {post} /api/v1/fablabs/ Create new Fablab
 * @apiName CreateNewFablab
 * @apiVersion 1.0.0
 * @apiGroup Fablabs
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} is the name of the fablab (required)
 * @apiParam {Object} address is the address object of the fablab (required)
 * @apiParamExample {json} Request-Example:
 *
{
    "name": "Fablab Ostsee e.V.",
    "address": {
        "street": "Milkyway 5",
        "zipCode": "33445",
        "city": "City of Nowhere",
        "country": "Dreamland"
    }
}
 *
 * @apiSuccess {Object} fablab the fablab object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 OK
{
    "fablab": {
        "activated": true,
        "_id": "5bc05aa67b88dd2be5a09017",
        "name": "Fablab Ostsee e.V.",
        "address": {
            "street": "Milkyway 5",
            "zipCode": "33445",
            "city": "City of Nowhere",
            "country": "Dreamland"
        },
        "__v": 0
    }
}
 * @apiError 400 The request is malformed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
{
    "err": "Malformed request!",
    "stack": {
        ...
    }
}
 *
 *
 */
function create (params) {
  const fablab = new Fablab(params);
  return fablab.save();
}

/**
 * @api {put} /api/v1/fablabs/:id Updates a Fablab by a given id
 * @apiName UpdateFablabByID
 * @apiVersion 1.0.0
 * @apiGroup Fablabs
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {id} is the id of the fablab
 * @apiParam {String} is the name of the fablab
 * @apiParam {Object} address is the address object of the fablab
 *
 * @apiParamExample {json} Request-Example:
 *
{
    "name": "New Name",
    "address": {
        "street": "new Street",
        "zipCode": "22335",
        "city": "New City",
        "country": "New Land"
    }
}
 * @apiSuccess {Object} fablab the fablab object
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "fablab": {
        "activated": true,
        "_id": "5bc05290bf18281b2a8427f1",
        "name": "New Name",
        "address": {
            "street": "new Street",
            "zipCode": "22335",
            "city": "New City",
            "country": "New Land"
        },
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
 *       "error": "Fablab by id '9999' not found"
 *     }
 *
 *
 */
function update (_id, params) {
  return Fablab.update(
    { _id },
    params,
    { upsert: true }).then(() => Fablab.findOne({ _id }));
}

export default { get, getAll, create, update };
