import logger from '../logger';
import validatorService from '../services/validator.service';
import FablabService from '../services/fablab.service';

const fablabService = new FablabService();

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
function getAll(req, res) {
  fablabService.getAll().then((fablabs) => {
    logger.info(`GET Fablabs with result ${JSON.stringify(fablabs)}`);
    fablabs.forEach((fablab) => {
      delete fablab.password;
    });
    res.json({ fablabs });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
}

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
function get(req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    fablabService.get(req.params.id).then((fablab) => {
      if (!fablab) {
        logger.error({ error: `Fablab by id '${req.params.id}' not found` });
        res.status(404).send({ error: `Fablab by id '${req.params.id}' not found` });
      } else {
        logger.info(`GET FablabById with result ${JSON.stringify(fablab)}`);
        res.json({ fablab });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(500).send(err);
    });
  }
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
function create(req, res) {
  fablabService.create(req.body).then((fablab) => {
    logger.info(`POST Fablab with result ${JSON.stringify(fablab)}`);
    res.status(201).send({ fablab });
  }).catch((err) => {
    const msg = { err: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
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
function update(req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else if (Object.keys(req.body).length === 0) {
    const msg = { error: 'No params to update given!' };
    logger.error(msg);
    res.status(400).send(msg);
  } else {
    fablabService.get(req.params.id).then((fablab) => {
      if (!fablab) {
        const msg = { error: `Fablab by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        fablabService.update(req.params.id, req.body).then((fablab) => {
          logger.info(`PUT Fablab with result ${JSON.stringify(fablab)}`);
          res.status(200).send({ fablab });
        });
      }
    }).catch((err) => {
      const msg = { err: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
}

/**
 * @api {delete} /api/v1/fablabs/:id Marks an fablab als inactive
 * @apiName deleteFablab
 * @apiVersion 1.0.0
 * @apiGroup Fablabs
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { fablab } the deleted fablab
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "fablab": {
        "activated": false,
        "_id": "5bc07aca171a83680e1877f6",
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed Request!",
      "stack": {
          ...
      }
  }
 */
function deleteById(req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    fablabService.deleteById(req.params.id).then((fablab) => {
      logger.info(`DELETE Fablab with result ${JSON.stringify(fablab)}`);
      res.status(200).send({ fablab });
    }).catch((err) => {
      logger.error({ error: 'Malformed Request!', stack: err });
      res.status(400).send({ error: 'Malformed Request!', stack: err });
    });
  }
}

export default {
  get, getAll, create, update, deleteById
};
