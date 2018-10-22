import * as express from 'express';
import orderCtrl from '../controllers/order.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

/**
 * @api {get} /api/v1/orders/ Request the list of orders
 * @apiName GetOrders
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam (Query String) limit is the limit of objects to get
 * @apiParam (Query String) skip is the number of objects to skip
 * @apiSuccess {Array} orders an array of order objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "orders": [
        {
            "machine": {
                "_id": "5b55f7bf3fe0c8b01713b3ff",
                "type": "Printer"
            },
            "status": "new",
            "_id": "5b73f77739bbd845df0cb2df",
            "projectname": "Comment Test",
            "comments": [
                {
                    "_id": "5b73f77739bbd845df0cb2e0",
                    "author": "Test",
                    "content": "Test Comment",
                    "createdAt": "2018-08-15T09:50:47.475Z"
                },
                {
                    "_id": "5b73f7a939bbd845df0cb2e1",
                    "author": "Blub",
                    "content": "Bla",
                    "createdAt": "2018-08-15T09:51:37.983Z"
                }
            ],
            "editor": "Test",
            "owner": "Test",
            "token": "87250a41-2587-40bf-8b09-bcd2a32b2c2d",
            "createdAt": "2018-08-15T09:50:47.475Z",
            "files": [],
            "__v": 1
        },
        {
            "machine": {
                "_id": "5b55f7bf3fe0c8b01713b3e5",
                "type": "Lasercutter"
            },
            "status": "new",
            "_id": "5b73f81f39bbd845df0cb2e2",
            "projectname": "Test 2 ",
            "comments": [
                {
                    "_id": "5b73f81f39bbd845df0cb2e3",
                    "author": "Test",
                    "content": "Blub",
                    "createdAt": "2018-08-15T09:53:35.043Z"
                }
            ],
            "editor": "Test",
            "owner": "Test",
            "token": "e9a42f99-5689-4563-98ec-721abb754ba5",
            "createdAt": "2018-08-15T09:53:35.043Z",
            "files": [],
            "__v": 0
        }
    ]
}
* @apiSuccessExample Success-Response:
*    HTTP/1.1 204 No-Content
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get all orders!",
      "stack": {
          ...
      }
  }
* @apiSuccessExample Success-Response:
*    HTTP/1.1 206 Partial Content
*    {
      "orders": [
        {
            owner: "User X",
            editor: "Editor Y",
            files: {[
                ...
            ]},
            status: "production",
            comments: [{
                    content: "Please print this.",
                    author: "User X"
                }, {
                    conten: "Okay, I will do this.",
                    author: "Editor Y"
                }
            ],
        }
      ]
    }
*/
router.route('/').get((req, res) => {
  req.query = validatorService.checkQuery(req.query);
  orderCtrl.getOrders(undefined, req.query.limit, req.query.skip).then((orders) => {
    if (orders.length === 0) {
      logger.info('GET Orders without result');
      res.status(204).send();
    } else if (req.query.limit && req.query.skip) {
      logger.info(`GET Orders with partial result ${JSON.stringify(orders)}`);
      res.status(206).send({ orders });
    } else {
      logger.info(`GET Orders with results ${JSON.stringify(orders)}`);
      res.status(200).send({ orders });
    }
  }).catch((err) => {
    logger.error({ error: 'Error while trying to get all orders!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all orders!', stack: err });
  });
});

router.route('/search').post((req, res) => {
  req.body.query = validatorService.checkQuery(req.body.query);
  orderCtrl.getOrders(req.body.query, req.body.limit, req.body.skip).then((orders) => {
    if (orders.length === 0) {
      logger.info(`POST search for orders with query ${JSON.stringify(req.body.query)}, ` +
                `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ orders });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for orders with query ${JSON.stringify(req.body.query)}, ` +
                `limit ${req.body.limit} skip ${req.body.skip} ` +
                `holds partial results ${JSON.stringify(orders)}`);
      res.status(206).send({ orders });
    } else {
      logger.info(`POST search for orders with query ${JSON.stringify(req.body.query)}, ` +
                `limit ${req.body.limit} skip ${req.body.skip} ` +
                `holds results ${JSON.stringify(orders)}`);
      res.status(200).send({ orders });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific order with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific order with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
  });
});

/**
* @api {post} /api/v1/orders/count Counts the Orders
* @apiName CountOrders
* @apiVersion 1.0.0
* @apiGroup Orders
* @apiHeader (Needed Request Headers) {String} Content-Type application/json
*
* @apiParam query is the query object for mongoose
* @apiParamExample {json} Request-Example:
*
{
  "$or":
    [
      {
        "status": "new"
      },
      {
        "status": "deleted"
      }
    ]
}
* @apiSuccess {Object} count the number of orders
* @apiSuccessExample Success-Response:
*    HTTP/1.1 200 OK
{
   "count": 98
}
*
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while counting orders!",
      "stack": {
          ...
      }
  }
*/
router.route('/count').post((req, res) => {
  req.body = validatorService.checkQuery(req.body);
  orderCtrl.count(req.body.query).then((count) => {
    logger.info(`POST count with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error({ error: 'Error while counting orders!', err });
    res.status(500).send({ error: 'Error while counting orders!', err });
  });
});

/**
 * @api {post} /api/v1/orders/ Adds a new order
 * @apiName createOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {Object} machine simple object containing id and type of machine (required)
 * @apiParam {String} projectName name of the project (required)
 * @apiParam {Array} comments array of comment objects
 * @apiParam {String} editor name of assigned editor
 * @apiParam {String} owner name of owner of the order (required)
 *
 * @apiParamExample {json} Request-Example:
 * {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test"
}
 *
 * @apiSuccess { order } the new order object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "status": "new",
        "_id": "5b7403e85b1ddf5847ee59f2",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "e6ae7bef-657e-48e7-9c3b-960407cd7164",
        "createdAt": "2018-08-15T10:43:52.291Z",
        "files": [],
        "__v": 0
    }
}
  * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed order, one or more parameters wrong or missing",
      "stack": {
          ...
      }
  }
 */
router.route('/').post((req, res) => {
  orderCtrl.createOrder(req.body).then((order) => {
    logger.info(`POST Order with result ${JSON.stringify(order)}`);
    res.status(201).send({ order });
  }).catch((err) => {
    logger.error({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
    res.status(400).send({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
  });
});

/**
 * @api {put} /api/v1/orders/:id Updates an order or creates it, if it doesn't exists yet.
 * @apiName updateOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {Object} machine simple object containing id and type of machine (required)
 * @apiParam {String} projectName name of the project (required)
 * @apiParam {Array} comments array of comment objects
 * @apiParam {String} editor name of assigned editor
 * @apiParam {String} status name of status of the order (required)
 * @apiParam {String} token uuid as token for the external login (required)
 * @apiParam {String} owner name of owner of the order (required)
 *
 * @apiParamExample {json} Request-Example:
 * {
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "status": "new",
        "_id": "5b73ff2e88ccd44a93dda7db",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "66b0997a-b467-49fd-a769-242fc37ce78d",
        "createdAt": "2018-08-15T10:23:42.852Z",
        "files": [],
        "__v": 0
    }
}
 * @apiSuccess { order } the updated order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
  {
  'order'; : {
      'status'; : 'new',
      '_id'; : '5b55cf9730b4aa4bbeaf6f68',
      'comments'; : [
          {
              '_id': '5b583da5514fac1bb10832b6',
              'author': 'Mister Foo',
              'content': 'Hello there, could you print this?'
          }
      ],
      'editor'; : 'Mister Bar',
      'owner'; : 'Mister X',
      'files'; : [],
      'token'; : '42',
      '__v'; : 0;
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed update.",
      "stack": {
          ...
      }
  }
 */
router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.updateOrder(req.body).then((order) => {
      logger.info(`PUT Order with result ${JSON.stringify(order)}`);
      res.status(200).send({ order });
    }).catch((err) => {
      logger.error({ error: 'Malformed update.', stack: err });
      res.status(400).send({ error: 'Malformed update.', stack: err });
    });
  }
});

/**
 * @api {delete} /api/v1/orders/:id Marks an order as deleted
 * @apiName deleteOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { order } the deleted order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "status": "deleted",
        "_id": "5b73ff2e88ccd44a93dda7db",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "66b0997a-b467-49fd-a769-242fc37ce78d",
        "createdAt": "2018-08-15T10:23:42.852Z",
        "files": [],
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
router.route('/:id').delete((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.deleteOrder(req.params.id).then((order) => {
      logger.info(`DELETE Order with result ${JSON.stringify(order)}`);
      res.status(200).send({ order });
    }).catch((err) => {
      logger.error({ error: 'Malformed Request!', stack: err });
      res.status(400).send({ error: 'Malformed Request!', stack: err });
    });
  }
});

/**
 * @api {get} /api/v1/orders/status Request all valid status
 * @apiName getStatus
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { status } a list of valid status
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 * {
    "status": [
        "new",
        "assigned",
        "production",
        "shipment",
        "archived",
        "representive",
        "deleted"
    ]
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get all valid status!",
      "stack": {
          ...
      }
  }
 */
router.route('/status/').get((req, res) => {
  orderCtrl.getStatus().then((status) => {
    if (!status) {
      logger.info('GET status without result');
      res.status(204).send();
    } else {
      logger.info(`GET status with result ${JSON.stringify(status)}`);
      res.status(200).send({ status });
    }
  }).catch((err) => {
    logger.error({ error: 'Error while trying to get all valid status!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all valid status!', stack: err });
  });
});

/**
 * @api {post} /api/v1/orders/:id/comment Adds a new comment to an order
 * @apiName createOrder
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} author name of the writer of the comment (required)
 * @apiParam {String} content the content of the comment (required)
 *
 * @apiParamExample {json} Request-Example:
 {
    "author": "Test",
    "content": "Blub"
}

 * @apiSuccess { comment } the new comment object, if success
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
{
    "comment": {
        "timestamp": "2018-08-15T11:59:09.104Z",
        "author": "Test",
        "content": "Blub",
        "createdAt": "2018-08-15T11:59:09.133Z"
    }
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "Could not find any Order with id 9999",
      "stack": {
          ...
      }
  }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Malformed Request
  {
      "error": "Malformed Request! Could not add comment to order.",
      "stack": {
          ...
      }
  }
 */
router.route('/:id/comment').post((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.createComment(req.params.id, { timestamp: new Date(), ...req.body }).then((comment) => {
      if (!comment) {
        logger.error({ error: `Could not find any Order with id ${req.params.id}` });
        res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
      } else {
        logger.info(`POST comment with result ${JSON.stringify(comment)}`);
        res.status(201).send({ comment });
      }
    }).catch((err) => {
      logger.error({ error: 'Malformed Request! Could not add comment to order.', stack: err });
      res.status(400).send({ error: 'Malformed Request! Could not add comment to order.', stack: err });
    });
  }
});

/**
 * @api {get} /api/v1/orders/:id Request an order by its id
 * @apiName getOrderById
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { order } a single order
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "order": {
        "machine": {
            "_id": "5b55f7bf3fe0c8b01713b3e5",
            "type": "Lasercutter"
        },
        "status": "new",
        "_id": "5b73f81f39bbd845df0cb2e2",
        "projectname": "Test 2 ",
        "comments": [
            {
                "_id": "5b73f81f39bbd845df0cb2e3",
                "author": "Test",
                "content": "Blub",
                "createdAt": "2018-08-15T09:53:35.043Z"
            }
        ],
        "editor": "Test",
        "owner": "Test",
        "token": "e9a42f99-5689-4563-98ec-721abb754ba5",
        "createdAt": "2018-08-15T09:53:35.043Z",
        "files": [],
        "__v": 0
    }
}
*
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "Could not find any Order with id 9999",
      "stack": {
          ...
      }
  }
* @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while trying to get Order with id 9999",
      "stack": {
          ...
      }
  }
 */
router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.getOrderById(req.params.id).then((order) => {
      if (!order) {
        logger.error({ error: `Could not find any Order with id ${req.params.id}` });
        res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
      } else {
        logger.info(`GET Order with result ${JSON.stringify(order)}`);
        res.status(200).send({ order });
      }
    }).catch((err) => {
      logger.error({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
      res.status(500).send({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
    });
  }
});

export default router;
